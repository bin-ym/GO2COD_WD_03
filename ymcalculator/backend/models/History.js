const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  expression: String,
  result: String,
}, { timestamps: true });

const History = mongoose.model("History", historySchema);

module.exports = History;
