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
            enum: ["dang_muon", "da_tra", "tre_han"],
            default: "dang_muon",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TheoDoiMuonSach", TheoDoiMuonSachSchema);
