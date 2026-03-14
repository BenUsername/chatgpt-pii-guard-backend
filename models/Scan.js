const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true },
  message_id: { type: String, required: true },
  flagged: { type: Boolean, required: true },
  reason: { type: String, default: null },
  patterns_matched: [String],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', ScanSchema);
