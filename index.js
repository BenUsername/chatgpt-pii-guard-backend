require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { analyzeText } = require('./analyzer');
const Scan = require('./models/Scan');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  } else {
    console.warn('Warning: MONGODB_URI not provided.');
  }
};

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'chrome-extension://*'
}));
app.use(express.json());

// Ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.post('/analyze', async (req, res) => {
  const { conversation_id, message_id, text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const result = analyzeText(text);
  
  // Persist to MongoDB if available
  if (mongoose.connection.readyState === 1) {
    try {
      await Scan.create({
        conversation_id,
        message_id,
        flagged: result.flagged,
        reason: result.reason,
        patterns_matched: result.patterns_matched
      });
    } catch (dbErr) {
      console.error('Failed to save scan result:', dbErr);
    }
  }

  console.log(`[${new Date().toISOString()}] Analysis: CID=${conversation_id} Flagged=${result.flagged} Patterns=[${result.patterns_matched.join(',')}]`);

  res.json({
    conversation_id,
    message_id,
    ...result
  });
});

app.get('/scans', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }
  try {
    const scans = await Scan.find().sort({ timestamp: -1 }).limit(20);
    res.json(scans);
  } catch (err) {
    console.error('Failed to fetch scans:', err);
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
