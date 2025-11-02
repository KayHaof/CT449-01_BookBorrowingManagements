const Reader = require("../models/DocGia");

const getAll = async (req, res) => {
    try {
        const readers = await Reader.find();
        res.json(readers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const reader = await Reader.findById(req.params.id);
        if (!reader)
            return res.status(404).json({ message: "Reader not found" });
        res.json(reader);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const reader = new Reader(req.body);
        await reader.save();
        res.status(201).json(reader);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const reader = await Reader.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(reader);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await Reader.findByIdAndDelete(req.params.id);
        res.json({ message: "Reader deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
