const Publisher = require("../models/NhaXuatBan");

const getAll = async (req, res) => {
    try {
        const publishers = await Publisher.find();
        res.json(publishers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const publisher = await Publisher.findById(req.params.id);
        if (!publisher)
            return res.status(404).json({ message: "Publisher not found" });
        res.json(publisher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const publisher = new Publisher(req.body);
        await publisher.save();
        res.status(201).json(publisher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const publisher = await Publisher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(publisher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await Publisher.findByIdAndDelete(req.params.id);
        res.json({ message: "Publisher deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
