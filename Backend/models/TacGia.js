const mongoose = require("mongoose");

const TacGiaSchema = new mongoose.Schema(
    {
        maTacGia: { type: String, unique: true, required: true },
        hoTen: { type: String, required: true },
        ngaySinh: Date,
        queQuan: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("TacGia", TacGiaSchema);
