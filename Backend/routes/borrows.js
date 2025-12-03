const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TheoDoiMuonSach = require("../models/TheoDoiMuonSach");

const {
    getById,
    create,
    update,
    remove,
    countActiveBorrows,
} = require("../controllers/borrowController");

router.get("/", async (req, res) => {
    try {
        const { maDocGia, maSach } = req.query;
        const query = {};

        if (maDocGia && mongoose.isValidObjectId(maDocGia)) {
            query.maDocGia = new mongoose.Types.ObjectId(maDocGia);
        }
        if (maSach && mongoose.isValidObjectId(maSach)) {
            query.maSach = new mongoose.Types.ObjectId(maSach);
        }

        const borrows = await TheoDoiMuonSach.find(query)
            .populate("maDocGia")
            .populate("maSach");

        res.json(borrows);
    } catch (err) {
        console.error("Lỗi GET /borrows:", err);
        res.status(500).json({ message: "Lỗi server khi lấy borrows." });
    }
});

// GET BY ID
router.get("/:id", getById);

// CREATE
router.post("/", create);

// UPDATE
router.put("/:id", update);

// DELETE
router.delete("/:id", remove);

router.get("/count/:readerId", countActiveBorrows);

module.exports = router;
