const express = require('express');
const router = express.Router();
const History = require('../model/History');

// POST: Save history
router.post('/', async (req, res) => {
  try {
    const { expression, result } = req.body;

    const newHistory = new History({
      expression,
      result,
    });

    const savedHistory = await newHistory.save();
    res.status(201).json({ message: 'History saved successfully', data: savedHistory });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// GET: Fetch all history
router.get('/', async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// DELETE: Clear all history
router.delete('/', async (req, res) => {
  try {
    await History.deleteMany({});
    res.status(200).json({ message: 'All history cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
