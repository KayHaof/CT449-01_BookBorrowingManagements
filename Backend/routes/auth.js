// Backend/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// CHỈ /login thôi, prefix /auth sẽ gắn ở app.js
router.post("/login", authController.login);

module.exports = router;
