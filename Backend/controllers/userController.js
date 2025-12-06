const User = require("../models/NguoiDung");
const Staff = require("../models/NhanVien");

const getAll = async (req, res) => {
    try {
        const users = await User.find().populate("refId");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("refId");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    try {
        let { maND, tenDangNhap, matKhau, vaiTro, refId } = req.body;

        console.log(refId);
        

        // let refId = null;

        // Nếu là Admin → tạo bản ghi trong NhanVien trước
        if (vaiTro === "Admin") {
            const staff = await Staff.create({
                maNV: maND,
                hoTenNV: tenDangNhap, // hoặc để tên riêng tùy bạn
                matKhau: matKhau,
                chucVu: "Admin",
            });

            refId = staff._id;
        }

        // Tạo user
        const newUser = await User.create({
            maND,
            tenDangNhap,
            matKhau,
            vaiTro,
            refId,
        });

        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

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

const getByRef = async (req, res) => {
    try {
        const user = await User.findOne({ refId: req.params.refId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Thiếu thông tin cần thiết.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy user.",
            });
        }

        if (user.matKhau !== currentPassword) {
            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng.",
            });
        }

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

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    changePassword,
    getByRef,
};
