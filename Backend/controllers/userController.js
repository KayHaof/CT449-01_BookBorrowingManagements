const User = require("../models/NguoiDung");

// LẤY TẤT CẢ USER
const getAll = async (req, res) => {
    try {
        const users = await User.find().populate("refId");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// LẤY USER THEO ID
const getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("refId");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// TẠO USER
const create = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// CẬP NHẬT USER
const update = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// XOÁ USER
const remove = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ==========================================
   🔥  API ĐỔI MẬT KHẨU (KHÔNG HASH)
   ========================================== */
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Thiếu thông tin cần thiết.",
            });
        }

        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
            });
        }

        // Lấy user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy user.",
            });
        }

        // Kiểm tra mật khẩu hiện tại khớp hay không
        if (user.matKhau !== currentPassword) {
            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng.",
            });
        }

        // Cập nhật mật khẩu
        user.matKhau = newPassword;
        await user.save();

        res.json({
            message: "Đổi mật khẩu thành công!",
        });
    } catch (err) {
        res.status(500).json({
            message: "Lỗi server khi đổi mật khẩu.",
        });
    }
};

module.exports = { getAll, getById, create, update, remove, changePassword };
