const mongoose = require("mongoose");

const NhaXuatBanSchema = new mongoose.Schema(
    {
        maNXB: { type: String, unique: true, required: true },
        tenNXB: { type: String, required: true },
        diaChi: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("NhaXuatBan", NhaXuatBanSchema);
