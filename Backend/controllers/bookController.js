const Book = require("../models/Sach");

const getAll = async (req, res) => {
    try {
        const books = await Book.find()
            .populate("maNhaXuatBan")
            .populate("maPhanLoai")
            .populate("maTacGia");
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate("maNhaXuatBan")
            .populate("maPhanLoai")
            .populate("maTacGia");
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
