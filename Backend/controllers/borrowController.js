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
        const borrow = await Borrow.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(borrow);
    } catch (err) {
        res.status(400).json({ message: err.message });
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

module.exports = { getAll, getById, create, update, remove };
