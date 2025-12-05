import api from '@/composables/useApi'

export default function useStaffs() {
  const getStaffs = () => api.get('/staffs')

  const createFullStaff = async (data) => {
    const staff = await api.post('/staffs', {
      maNV: data.maNV,
      hoTenNV: data.hoTenNV,
      chucVu: data.chucVu,
      diaChi: data.diaChi,
      soDienThoai: data.soDienThoai,
      matKhau: data.matKhau,
    })
    
    const maND = 'ND' + Date.now()

    await api.post('/users', {
      maND,
      tenDangNhap: data.tenDangNhap,
      matKhau: data.matKhau,
      vaiTro: 'NhanVien',
      refId: staff._id,
    })

    return staff
  }

  const updateStaff = (id, d) => api.put(`/staffs/${id}`, d)

  const deleteStaff = (id) => api.delete(`/staffs/${id}`)

  return {
    getStaffs,
    createFullStaff,
    updateStaff,
    deleteStaff,
  }
}
