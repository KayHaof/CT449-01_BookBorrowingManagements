import { ref } from 'vue'
import { api } from '@/services/apiService'

export default function useProfile() {
  const user = ref(null)
  const docGia = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const passwordLoading = ref(false)
  const passwordError = ref('')
  const passwordSuccess = ref('')

  const editLoading = ref(false) // ⚠️ BẮT BUỘC PHẢI KHAI BÁO

  const stats = ref({
    tongMuon: 0,
    dangMuon: 0,
    chuaTra: 0,
    traDungHan: 0,
    traTre: 0,
    tongTienPhat: 0,
    soPhieuPhat: 0,
    tiLeDungHan: 0,
  })

  function loadLocalUser() {
    try {
      const rawUser = localStorage.getItem('user')
      if (!rawUser) return null
      user.value = JSON.parse(rawUser)
      return user.value
    } catch (err) {
      console.error('Lỗi đọc localStorage:', err)
      return null
    }
  }

  async function fetchProfile() {
    loading.value = true
    error.value = null

    try {
      const localUser = loadLocalUser()

      if (!localUser?.refId) {
        error.value = 'Không tìm thấy ID độc giả.'
        return
      }

      const res = await api.get(`/readers/${localUser.refId}`)
      docGia.value = res.data
    } catch (err) {
      console.error('Lỗi tải hồ sơ:', err)
      error.value = err.response?.data?.message || 'Lỗi khi tải thông tin người dùng'
    } finally {
      loading.value = false
    }
  }

  async function changePassword(currentPassword, newPassword, confirmPassword) {
    passwordError.value = ''
    passwordSuccess.value = ''

    if (!currentPassword) {
      passwordError.value = 'Vui lòng nhập mật khẩu hiện tại.'
      return false
    }
    if (!newPassword || newPassword.length < 6) {
      passwordError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự.'
      return false
    }
    if (newPassword !== confirmPassword) {
      passwordError.value = 'Xác nhận mật khẩu không trùng khớp.'
      return false
    }

    try {
      passwordLoading.value = true

      await api.put(`/users/change-password`, {
        userId: user.value.id,
        currentPassword,
        newPassword,
      })

      passwordSuccess.value = 'Đổi mật khẩu thành công!'
      return true
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err)
      passwordError.value = err.response?.data?.message || 'Không thể đổi mật khẩu.'
      return false
    } finally {
      passwordLoading.value = false
    }
  }

  async function fetchStats() {
    try {
      const localUser = loadLocalUser()
      if (!localUser?.refId) return

      const borrowRes = await api.get(`/borrows`)
      const userBorrows = borrowRes.data.filter((b) => b.maDocGia?._id === localUser.refId)

      const fineRes = await api.get(`/fines`)
      const userFines = fineRes.data.filter((f) =>
        userBorrows.some((b) => b._id === f.maMuonSach?._id),
      )

      const tongMuon = userBorrows.length
      const dangMuon = userBorrows.filter((b) => b.trangThai === 'dang_muon').length
      const traTre = userBorrows.filter((b) => b.trangThai === 'tre_han').length

      const traDungHan = userBorrows.filter((b) => {
        if (!b.ngayTra) return false
        const hanTra = new Date(b.ngayMuon)
        hanTra.setDate(hanTra.getDate() + 7)
        return new Date(b.ngayTra) <= hanTra
      }).length

      const chuaTra = dangMuon + traTre
      const tongTienPhat = userFines.reduce((sum, f) => sum + (f.soTien || 0), 0)
      const soPhieuPhat = userFines.length
      const tiLeDungHan = tongMuon > 0 ? ((traDungHan / tongMuon) * 100).toFixed(1) : 0

      stats.value = {
        tongMuon,
        dangMuon,
        chuaTra,
        traDungHan,
        traTre,
        tongTienPhat,
        soPhieuPhat,
        tiLeDungHan,
      }
    } catch (err) {
      console.error('Lỗi thống kê:', err)
    }
  }

  async function updateProfile(newData) {
    try {
      const localUser = loadLocalUser()
      if (!localUser?.refId) throw new Error('Không tìm thấy ID độc giả')

      editLoading.value = true

      // convert day
      if (newData.ngaySinh) {
        newData.ngaySinh = new Date(newData.ngaySinh).toISOString()
      }

      await api.put(`/readers/${localUser.refId}`, newData)

      await fetchProfile()

      return true
    } catch (err) {
      console.error('Lỗi cập nhật thông tin:', err)
      return false
    } finally {
      editLoading.value = false
    }
  }

  fetchStats()
  loadLocalUser()
  fetchProfile()

  return {
    user,
    docGia,
    loading,
    error,

    stats,
    fetchStats,

    changePassword,
    updateProfile,

    passwordLoading,
    passwordError,
    passwordSuccess,

    editLoading,
  }
}
