<template>
  <div class="min-vh-100 d-flex align-items-center py-1 register-bg">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-7">
          <div class="card shadow-lg border-0 register-card">
            <div class="card-body p-5">
              <div class="text-center mb-5">
                <!-- Logo -->
                <div class="mb-3">
                  <img src="/logo.jpg" alt="Library Logo" class="register-logo" />
                </div>

                <h1 class="card-title fs-3 fw-bold text-dark">Đăng Ký Tài Khoản</h1>
                <p class="text-muted">Quản Lý Mượn Sách - Hệ Thống Thư Viện</p>
              </div>

              <!-- Thông báo lỗi -->
              <div
                v-if="errorMessage"
                class="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <i class="fa-solid fa-circle-exclamation me-2"></i>
                {{ errorMessage }}
                <button type="button" class="btn-close" @click="errorMessage = ''"></button>
              </div>

              <!-- Form đăng ký -->
              <form @submit.prevent="handleRegister">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold text-dark">Họ lót</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.hoLot"
                      placeholder="Nguyễn Văn"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold text-dark">Tên</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.ten"
                      placeholder="A"
                      required
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold text-dark">Ngày sinh</label>
                    <input type="date" class="form-control" v-model="formData.ngaySinh" required />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label fw-semibold text-dark">Giới tính</label>
                    <select class="form-select" v-model="formData.phai" required>
                      <option value="" disabled>-- Chọn giới tính --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Địa chỉ</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.diaChi"
                    placeholder="Đ. 3/2, P.Ninh Kiều, TP.Cần Thơ"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Số điện thoại</label>
                  <input
                    type="tel"
                    class="form-control"
                    v-model="formData.dienThoai"
                    placeholder="0912345678"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Tên đăng nhập</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.tenDangNhap"
                    placeholder="nhap_ten_dang_nhap"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold text-dark">Mật khẩu</label>
                  <div class="input-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      v-model="formData.matKhau"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn btn-register btn-lg w-100 fw-semibold text-white">
                  <span v-if="!isLoading"> <i class="fa-solid fa-user-plus me-2"></i>Đăng ký </span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    Đang xử lý...
                  </span>
                </button>
              </form>

              <!-- Divider -->
              <div class="d-flex align-items-center my-2">
                <hr class="flex-grow-1" />
                <span class="mx-2 text-muted small">Hoặc</span>
                <hr class="flex-grow-1" />
              </div>

              <!-- Link đăng nhập -->
              <p class="text-center text-muted mb-0">
                Đã có tài khoản?
                <router-link to="/login" class="text-primary fw-semibold text-decoration-none">
                  Đăng nhập ngay
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerReader } from '../services/registerService.js'

const router = useRouter()
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

const formData = ref({
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
  errorMessage.value = ''
  isLoading.value = true

  try {
    await registerReader(formData.value)
    alert('Đăng ký thành công!')
    router.push('/login')
  } catch (err) {
    errorMessage.value = err.message || 'Đăng ký thất bại!'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped src="../assets/css/register.css"></style>
