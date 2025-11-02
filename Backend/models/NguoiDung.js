const mongoose = require("mongoose");

const NguoiDungSchema = new mongoose.Schema(
    {
        maND: { type: String, unique: true, required: true },
        tenDangNhap: { type: String, unique: true, required: true },
        matKhau: { type: String, required: true },
        vaiTro: {
            type: String,
            enum: ["DocGia", "NhanVien", "Admin"],
            default: "DocGia",
        },
        refId: { type: mongoose.Schema.Types.ObjectId, refPath: "vaiTro" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("NguoiDung", NguoiDungSchema);
