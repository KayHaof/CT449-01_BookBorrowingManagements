const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema(
    {
        maNV: { type: String, unique: true, required: true },
        hoTenNV: { type: String, required: true },
        matKhau: { type: String, required: true },
        chucVu: String,
        diaChi: String,
        soDienThoai: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("NhanVien", NhanVienSchema, "NhanVien");
