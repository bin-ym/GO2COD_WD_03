const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const History = require("./models/History"); // Ensure you have this model for storing history

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes (you can specify origin if needed)

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/ymcalculator", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes

// Get history
app.get("/api/history", async (req, res) => {
  try {
    const history = await History.find(); // Get all history from DB
    res.json(history); // Return the history data
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
});

// Add history
app.post("/api/history", async (req, res) => {
  try {
    const { expression, result } = req.body;

    const newHistory = new History({
      expression: expression,
      result: result,
    });

    await newHistory.save(); // Save history to DB
    res.status(201).json({ message: "History saved successfully" });
  } catch (error) {
    console.error("Error saving history:", error);
    res.status(500).json({ message: "Error saving history" });
  }
});

// Clear history
app.delete("/api/history", async (req, res) => {
  try {
    await History.deleteMany(); // Clear all history from DB
    res.json({ message: "History cleared successfully" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ message: "Error clearing history" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
