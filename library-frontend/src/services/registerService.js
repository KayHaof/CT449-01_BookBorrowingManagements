import axios from 'axios'

const API_URL = 'http://localhost:8080/api' // chỉnh lại cho đúng BE của bạn

export async function registerReader(formData) {
  try {
    // === Tạo độc giả trước ===
    const docGiaRes = await axios.post(`${API_URL}/readers`, {
      maDocGia: `DG${Date.now()}`,
      hoLot: formData.hoLot,
      ten: formData.ten,
      ngaySinh: formData.ngaySinh,
      phai: formData.phai,
      diaChi: formData.diaChi,
      dienThoai: formData.dienThoai,
    })

    const refId = docGiaRes.data._id

    // === Sau đó tạo người dùng liên kết với độc giả ===
    await axios.post(`${API_URL}/users`, {
      maND: `ND${Date.now()}`,
      tenDangNhap: formData.tenDangNhap,
      matKhau: formData.matKhau,
      vaiTro: 'DocGia',
      refId: refId,
    })
  } catch (err) {
    console.error('Register error:', err)
    throw new Error(err.response?.data?.message || 'Không thể đăng ký tài khoản. Vui lòng thử lại.')
  }
}
