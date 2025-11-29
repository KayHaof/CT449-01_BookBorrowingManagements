import { ref } from 'vue'
import { api } from '@/services/apiService'

export default function useProfile() {
  const user = ref(null) // từ localStorage
  const docGia = ref(null) // từ DB
  const loading = ref(false)
  const error = ref(null)

  // ====== STATE CHO ĐỔI MẬT KHẨU ======
  const passwordLoading = ref(false)
  const passwordError = ref('')
  const passwordSuccess = ref('')

  // ===== Lấy user từ localStorage =====
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

  // ========== Fetch hồ sơ độc giả ==========
  async function fetchProfile() {
    loading.value = true
    error.value = null

    try {
      const localUser = loadLocalUser()

      if (!localUser) {
        error.value = 'Không tìm thấy dữ liệu người dùng.'
        return
      }

      if (!localUser.refId) {
        error.value = 'Tài khoản không có refId để truy xuất thông tin độc giả.'
        return
      }

      // Gọi API lấy thông tin độc giả
      const res = await api.get(`/readers/${localUser.refId}`)
      docGia.value = res.data
    } catch (err) {
      console.error('Lỗi tải hồ sơ:', err)
      error.value = err.response?.data?.message || 'Lỗi khi tải thông tin người dùng'
    } finally {
      loading.value = false
    }
  }

  // ========== Logic đổi mật khẩu ==========
  async function changePassword(currentPassword, newPassword, confirmPassword) {
    // Reset state
    passwordError.value = ''
    passwordSuccess.value = ''

    // ---- FE VALIDATE ----
    if (!currentPassword) return (passwordError.value = 'Vui lòng nhập mật khẩu hiện tại.')

    if (!newPassword || newPassword.length < 6)
      return (passwordError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự.')

    if (newPassword !== confirmPassword)
      return (passwordError.value = 'Xác nhận mật khẩu không trùng khớp.')

    try {
      passwordLoading.value = true

      // CALL API BACKEND
      const res = await api.put(`/users/change-password`, {
        userId: user.value.id, // lấy từ localStorage
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

  // ======= Reload profile =======
  async function refresh() {
    await fetchProfile()
  }

  // auto load
  loadLocalUser()
  fetchProfile()

  return {
    user,
    docGia,
    loading,
    error,
    refresh,

    // password change expose
    changePassword,
    passwordLoading,
    passwordError,
    passwordSuccess,
  }
}
