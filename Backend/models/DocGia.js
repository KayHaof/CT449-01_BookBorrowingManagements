const mongoose = require("mongoose");

const DocGiaSchema = new mongoose.Schema(
    {
        maDocGia: { type: String, unique: true, required: true },
        hoLot: { type: String, required: true },
        ten: { type: String, required: true },
        ngaySinh: Date,
        phai: { type: String, enum: ["Nam", "Nữ"] },
        diaChi: String,
        dienThoai: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("DocGia", DocGiaSchema, "DocGia");
