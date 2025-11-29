const mongoose = require("mongoose");

const PhanLoaiSachSchema = new mongoose.Schema(
    {
        maLoai: { type: String, unique: true, required: true },
        tenLoai: { type: String, required: true },
        moTa: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("PhanLoaiSach", PhanLoaiSachSchema);
