const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  expression: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', HistorySchema);
