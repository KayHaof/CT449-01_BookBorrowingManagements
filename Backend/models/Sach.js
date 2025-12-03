const mongoose = require("mongoose");

const SachSchema = new mongoose.Schema(
    {
        maSach: { type: String, unique: true, required: true },
        tenSach: { type: String, required: true },
        donGia: Number,
        soQuyen: Number,
        namXuatBan: Number,
        biaSach: String,
        maNhaXuatBan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NhaXuatBan",
        },
        maPhanLoai: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PhanLoaiSach",
        },
        maTacGia: [{ type: mongoose.Schema.Types.ObjectId, ref: "TacGia" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Sach", SachSchema, "Sach");
