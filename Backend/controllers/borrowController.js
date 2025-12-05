const Borrow = require("../models/TheoDoiMuonSach");

const getAll = async (req, res) => {
    try {
        const borrows = await Borrow.find()
            .populate("maDocGia")
            .populate("maSach");
        res.json(borrows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getByUser = async (req, res) => {
    try {
        const borrows = await Borrow.find({ maDocGia: req.params.userId })
            .populate("maDocGia")
            .populate("maSach");

        res.json(borrows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const borrow = await Borrow.findById(req.params.id)
            .populate("maDocGia")
            .populate("maSach");
        if (!borrow)
            return res.status(404).json({ message: "Record not found" });
        res.json(borrow);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const borrow = new Borrow(req.body);
        await borrow.save();
        res.status(201).json(borrow);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { trangThai } = req.body;

        const oldBorrow = await Borrow.findById(req.params.id)
            .populate("maDocGia")
            .populate("maSach");

        if (!oldBorrow) {
            return res.status(404).json({ message: "Borrow not found" });
        }

        const borrow = await Borrow.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })
            .populate("maDocGia")
            .populate("maSach");

        if (oldBorrow.trangThai !== "da_tra" && trangThai === "da_tra") {
            const Book = require("../models/Sach");
            await Book.findByIdAndUpdate(borrow.maSach._id, {
                $inc: { soQuyen: 1 },
            });
        }

        if (global._io) {
            global._io.emit("borrow_updated", borrow);
        }

        if (trangThai === "tre_han") {
            return res.json({
                requireFine: true,
                message: "Phiếu mượn đã chuyển sang TRỄ HẠN.",
                borrow,
            });
        }

        return res.json(borrow);
    } catch (err) {
        console.error("Lỗi update borrow:", err);
        return res.status(400).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await Borrow.findByIdAndDelete(req.params.id);
        res.json({ message: "Borrow record deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const countActiveBorrows = async (req, res) => {
    try {
        const count = await Borrow.countDocuments({
            maDocGia: req.params.readerId,
            trangThai: "dang_muon",
        });

        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    countActiveBorrows,
    getByUser,
};
