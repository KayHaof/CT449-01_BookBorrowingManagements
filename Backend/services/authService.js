const NguoiDung = require("../models/NguoiDung");

exports.login = async (tenDangNhap, matKhau) => {
    const user = await NguoiDung.findOne({ tenDangNhap });

    if (!user) {
        throw new Error("Tên đăng nhập không tồn tại");
    }

    if (user.matKhau !== matKhau) {
        throw new Error("Mật khẩu không đúng");
    }

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
