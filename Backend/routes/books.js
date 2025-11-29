const express = require("express");
const {
    getAll,
    getById,
    create,
    update,
    remove,
} = require("../controllers/bookController");

const router = express.Router();

// === BOOKS (Sach) ===
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
