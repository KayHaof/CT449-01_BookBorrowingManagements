// Backend/services/authService.js
const NguoiDung = require("../models/NguoiDung"); // ĐÚNG tên file model

exports.login = async (tenDangNhap, matKhau) => {
    // tìm user theo tên đăng nhập
    const user = await NguoiDung.findOne({ tenDangNhap });

    if (!user) {
        throw new Error("Tên đăng nhập không tồn tại");
    }

    // Bạn hiện tại KHÔNG mã hoá mật khẩu → so sánh trực tiếp
    if (user.matKhau !== matKhau) {
        throw new Error("Mật khẩu không đúng");
    }

    // Trả về thông tin user cho FE
    return {
        message: "Đăng nhập thành công",
        user: {
            id: user._id,
            maND: user.maND,
            tenDangNhap: user.tenDangNhap,
            vaiTro: user.vaiTro,
            refId: user.refId,
        },
    };
};
