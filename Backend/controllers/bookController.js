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
        let data = req.body;

        if (data.maTacGia) {
            data.maTacGia = JSON.parse(data.maTacGia);
        }

        if (req.file) {
            data.biaSach = "/assets/" + req.file.filename;
        }

        const book = new Book(data);
        await book.save();

        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        let data = req.body;

        if (data.maTacGia) {
            data.maTacGia = JSON.parse(data.maTacGia);
        }

        if (req.file) {
            data.biaSach = "/assets/images/" + req.file.filename;
        }

        const book = await Book.findByIdAndUpdate(req.params.id, data, {
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
