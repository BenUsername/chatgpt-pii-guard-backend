require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeText } = require('./analyzer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'chrome-extension://*'
}));
app.use(express.json());

app.post('/analyze', (req, res) => {
  const { conversation_id, message_id, text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const result = analyzeText(text);
  
  console.log(`[${new Date().toISOString()}] Analysis: CID=${conversation_id} Flagged=${result.flagged} Patterns=[${result.patterns_matched.join(',')}]`);

  res.json({
    conversation_id,
    message_id,
    ...result
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
