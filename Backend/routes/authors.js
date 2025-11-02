const express = require("express");
const {
    getAll,
    getById,
    create,
    update,
    remove,
} = require("../controllers/authorController");

const router = express.Router();

// === AUTHORS (TacGia) ===
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
