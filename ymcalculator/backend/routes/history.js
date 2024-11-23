const express = require('express');
const History = require('../models/History');

const router = express.Router();

// Save a new history record
router.post('/', async (req, res) => {
  try {
    const { expression, result } = req.body;

    const newHistory = new History({
      expression,
      result,
    });

    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// Get all history records
router.get('/', async (req, res) => {
  try {
    const history = await History.find().sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Clear all history
router.delete('/', async (req, res) => {
  try {
    await History.deleteMany({});
    res.status(200).json({ message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

module.exports = router;
