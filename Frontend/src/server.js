require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("=> API Quản lý mượn sách running...");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`=> Server running on port ${PORT}`));
