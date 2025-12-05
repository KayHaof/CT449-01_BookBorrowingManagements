import { ref } from 'vue'
import { loginUser } from '../services/authService'
import { createReader } from '../services/readerService'
import { createUser } from '../services/userService'
import { useRouter } from 'vue-router'
import { toast } from '@/utils/toast'

export function useAuth() {
  const router = useRouter()

  const isLoading = ref(false)
  const showPassword = ref(false)

  const loginData = ref({
    tenDangNhap: '',
    password: '',
    rememberMe: false,
  })

  const handleLogin = async () => {
    isLoading.value = true

    try {
      const res = await loginUser({
        tenDangNhap: loginData.value.tenDangNhap,
        matKhau: loginData.value.password,
      })

      localStorage.setItem('user', JSON.stringify(res.user))
      toast.success('Đăng nhập thành công!')
      router.push('/')
    } catch (err) {
      const msg = err.message || 'Đăng nhập thất bại!'
      toast.error(msg)
    } finally {
      isLoading.value = false
    }
  }

  const registerData = ref({
    hoLot: '',
    ten: '',
    ngaySinh: '',
    phai: '',
    diaChi: '',
    dienThoai: '',
    tenDangNhap: '',
    matKhau: '',
    xacNhanMatKhau: '',
  })

  const handleRegister = async () => {
    isLoading.value = true

    if (registerData.value.matKhau !== registerData.value.xacNhanMatKhau) {
      toast.error('Mật khẩu không khớp!')
      isLoading.value = false
      return
    }

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

      toast.success('Đăng ký thành công!')

      router.push('/auth/login')
    } catch (err) {
      toast.error('Đăng ký thất bại!')
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
    showPassword,
  }
}
