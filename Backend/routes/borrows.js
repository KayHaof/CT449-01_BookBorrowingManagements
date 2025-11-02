const express = require("express");
const {
    getAll,
    getById,
    create,
    update,
    remove,
} = require("../controllers/borrowController");

const router = express.Router();

// === BORROW RECORDS (TheoDoiMuonSach) ===
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
