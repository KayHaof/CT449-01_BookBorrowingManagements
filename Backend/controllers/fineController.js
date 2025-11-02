const Fine = require("../models/PhieuPhat");

const getAll = async (req, res) => {
    try {
        const fines = await Fine.find()
            .populate("maNVLap")
            .populate("maMuonSach");
        res.json(fines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const fine = await Fine.findById(req.params.id)
            .populate("maNVLap")
            .populate("maMuonSach");
        if (!fine) return res.status(404).json({ message: "Fine not found" });
        res.json(fine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const fine = new Fine(req.body);
        await fine.save();
        res.status(201).json(fine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const fine = await Fine.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(fine);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await Fine.findByIdAndDelete(req.params.id);
        res.json({ message: "Fine deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
