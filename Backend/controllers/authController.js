const authService = require("../services/authService");

exports.login = async (req, res) => {
    try {
        const { tenDangNhap, matKhau } = req.body;
        const result = await authService.login(tenDangNhap, matKhau);

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
