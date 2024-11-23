const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const History = require("./models/History");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000; // Use PORT from .env or default to 5000

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes

// Get history
app.get("/api/history", async (req, res) => {
  try {
    const history = await History.find();
    res.json(history);
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
      expression,
      result,
    });

    await newHistory.save();
    res.status(201).json({ message: "History saved successfully" });
  } catch (error) {
    console.error("Error saving history:", error);
    res.status(500).json({ message: "Error saving history" });
  }
});

// Clear history
app.delete("/api/history", async (req, res) => {
  try {
    await History.deleteMany();
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
