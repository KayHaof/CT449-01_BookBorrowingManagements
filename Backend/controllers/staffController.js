const Staff = require("../models/NhanVien");

const getAll = async (req, res) => {
    try {
        const staffs = await Staff.find();
        res.json(staffs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.status(201).json(staff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ message: "Staff deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
