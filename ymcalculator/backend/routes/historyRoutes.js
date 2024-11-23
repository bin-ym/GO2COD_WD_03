const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors()); // Allow all origins (for development)
app.use(express.json()); // To parse JSON bodies

// In-memory history array (you can use a database in production)
let history = [];

// Get history
app.get("/api/history", (req, res) => {
  res.json(history);
});

// Add history
app.post("/api/history", (req, res) => {
  const { expression, result } = req.body;
  if (expression && result !== undefined) {
    history.push(`${expression} = ${result}`);
    res.status(200).send("History saved");
  } else {
    res.status(400).send("Invalid request");
  }
});

// Clear history
app.delete("/api/history", (req, res) => {
  history = [];
  res.status(200).send("History cleared");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
