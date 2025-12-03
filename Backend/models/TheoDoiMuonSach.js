const mongoose = require("mongoose");

const TheoDoiMuonSachSchema = new mongoose.Schema(
    {
        maMuon: { type: String, unique: true, required: true },
        maDocGia: { type: mongoose.Schema.Types.ObjectId, ref: "DocGia" },
        maSach: { type: mongoose.Schema.Types.ObjectId, ref: "Sach" },
        ngayMuon: Date,
        ngayTra: Date,
        trangThai: {
            type: String,
            enum: ["dang_ky_muon", "dang_muon", "da_tra", "tre_han"],
            default: "dang_ky_muon",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "TheoDoiMuonSach",
    TheoDoiMuonSachSchema,
    "TheoDoiMuonSach"
);
