const mongoose = require("mongoose");

const PhieuPhatSchema = new mongoose.Schema(
    {
        maPhieuPhat: { type: String, unique: true, required: true },
        maNVLap: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
        maMuonSach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TheoDoiMuonSach",
        },
        soTien: Number,
        lyDo: String,
        ngayLap: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("PhieuPhat", PhieuPhatSchema, "PhieuPhat");
