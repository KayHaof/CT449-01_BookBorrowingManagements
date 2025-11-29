import { ref } from 'vue'
import { loginUser } from '../services/authService'
import { createReader } from '../services/readerService'
import { createUser } from '../services/userService'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  const isLoading = ref(false)
  const errorMessage = ref('')
  const showPassword = ref(false)

  // -------------------------------
  // FORM LOGIN
  // -------------------------------
  const loginData = ref({
    tenDangNhap: '',
    password: '',
    rememberMe: false,
  })

  const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const res = await loginUser({
        tenDangNhap: loginData.value.tenDangNhap,
        matKhau: loginData.value.password,
      })

      console.log('res = ', res)
      localStorage.setItem('user', JSON.stringify(res.user))

      router.push('/') // về trang chính
    } catch (err) {
      errorMessage.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // -------------------------------
  // FORM REGISTER (đã có từ trước)
  // -------------------------------
  const registerData = ref({
    hoLot: '',
    ten: '',
    ngaySinh: '',
    phai: '',
    diaChi: '',
    dienThoai: '',
    tenDangNhap: '',
    matKhau: '',
  })

  const handleRegister = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const maDG = 'DG' + Date.now()
      const reader = await createReader({
        maDocGia: maDG,
        hoLot: registerData.value.hoLot,
        ten: registerData.value.ten,
        ngaySinh: registerData.value.ngaySinh,
        phai: registerData.value.phai,
        diaChi: registerData.value.diaChi,
        dienThoai: registerData.value.dienThoai,
      })

      const maND = 'ND' + Date.now()
      await createUser({
        maND,
        tenDangNhap: registerData.value.tenDangNhap,
        matKhau: registerData.value.matKhau,
        vaiTro: 'DocGia',
        refId: reader._id,
      })

      alert('Đăng ký thành công!')
      router.push('/auth/login')
    } catch (err) {
      errorMessage.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return {
    // login
    loginData,
    handleLogin,
    // register
    registerData,
    handleRegister,

    // common
    isLoading,
    errorMessage,
    showPassword,
  }
}
