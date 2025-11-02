const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Library Borrowing System API!",
        version: "1.0.0",
        author: "Your Name",
    });
});

module.exports = router;
