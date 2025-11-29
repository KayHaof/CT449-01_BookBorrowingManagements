<template>
  <div class="profile-container min-vh-100 d-flex flex-column">
    <!-- Header -->
    <div class="profile-header gradient-bg-purple pb-5">
      <div class="container pt-4">
        <div class="row align-items-end g-4">
          <!-- User name -->
          <div class="col-md">
            <h1 class="display-5 text-white fw-bold mb-2">{{ docGia?.hoLot }} {{ docGia?.ten }}</h1>

            <p class="text-white-50 fs-5 mb-1">Độc giả • Thành viên từ {{ memberSince }}</p>

            <div class="d-flex gap-3 mt-3">
              <span class="badge bg-light text-dark fs-6">
                {{ stats.dangMuon }} sách đang mượn
              </span>
              <span class="badge bg-light text-dark fs-6"> {{ stats.chuaTra }} sách chưa trả </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="container my-5 flex-grow-1">
      <!-- Tabs -->
      <ul class="nav nav-tabs mb-4 border-bottom-2">
        <li class="nav-item">
          <button
            class="nav-link active fw-bold text-purple"
            data-bs-toggle="tab"
            data-bs-target="#personal-info"
          >
            <i class="fa-solid fa-user me-2"></i>Thông tin cá nhân
          </button>
        </li>

        <li class="nav-item">
          <button
            class="nav-link fw-bold text-purple"
            data-bs-toggle="tab"
            data-bs-target="#borrowing-history"
          >
            <i class="fa-solid fa-book-open me-2"></i>Lịch sử mượn
          </button>
        </li>

        <li class="nav-item">
          <button
            class="nav-link fw-bold text-purple"
            data-bs-toggle="tab"
            data-bs-target="#statistics"
          >
            <i class="fa-solid fa-chart-line me-2"></i>Thống kê
          </button>
        </li>
      </ul>

      <div class="tab-content">
        <!-- PERSONAL INFO -->
        <div class="tab-pane fade show active" id="personal-info">
          <div class="row g-4">
            <!-- LEFT -->
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-light border-bottom">
                  <h5 class="mb-0 text-purple fw-bold">
                    <i class="fa-solid fa-circle-info me-2"></i>Thông tin cá nhân
                  </h5>
                </div>

                <div class="card-body" v-if="docGia">
                  <div class="row mb-3">
                    <div class="col-6">
                      <label class="small text-muted fw-bold">Họ lót</label>
                      <p class="fs-6">{{ docGia.hoLot }}</p>
                    </div>

                    <div class="col-6">
                      <label class="small text-muted fw-bold">Tên</label>
                      <p class="fs-6">{{ docGia.ten }}</p>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-6">
                      <label class="small text-muted fw-bold">Ngày sinh</label>
                      <p class="fs-6">{{ formatDate(docGia.ngaySinh) }}</p>
                    </div>

                    <div class="col-6">
                      <label class="small text-muted fw-bold">Giới tính</label>
                      <p class="fs-6">{{ docGia.phai }}</p>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="small text-muted fw-bold">Số điện thoại</label>
                    <p class="fs-6">{{ docGia.dienThoai }}</p>
                  </div>

                  <div>
                    <label class="small text-muted fw-bold">Địa chỉ</label>
                    <p class="fs-6">{{ docGia.diaChi }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT SETTINGS -->
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-light border-bottom">
                  <h5 class="mb-0 text-purple fw-bold">
                    <i class="fa-solid fa-gear me-2"></i>Cài đặt tài khoản
                  </h5>
                </div>

                <div class="card-body">
                  <!-- BUTTON -->
                  <div v-if="!showChangePassword" class="mb-4">
                    <h6 class="fw-bold mb-2">Đổi mật khẩu</h6>
                    <button class="btn btn-outline-purple btn-sm" @click="toggleChangePassword">
                      Cập nhật mật khẩu
                    </button>
                  </div>

                  <!-- FORM ĐỔI MẬT KHẨU -->
                  <div v-if="showChangePassword">
                    <h6 class="fw-bold mb-3">Đổi mật khẩu</h6>

                    <!-- CURRENT PASSWORD -->
                    <div class="mb-3 position-relative">
                      <label class="form-label">Mật khẩu hiện tại</label>
                      <input
                        :type="showPassword.current ? 'text' : 'password'"
                        v-model="passwordForm.current"
                        class="form-control"
                      />
                      <i
                        class="fa-solid position-absolute password-toggle"
                        :class="showPassword.current ? 'fa-eye-slash' : 'fa-eye'"
                        @click="toggleShowPassword('current')"
                      ></i>
                    </div>

                    <!-- NEW PASSWORD -->
                    <div class="mb-3 position-relative">
                      <label class="form-label">Mật khẩu mới</label>
                      <input
                        :type="showPassword.new ? 'text' : 'password'"
                        v-model="passwordForm.new"
                        class="form-control"
                      />
                      <i
                        class="fa-solid position-absolute password-toggle"
                        :class="showPassword.new ? 'fa-eye-slash' : 'fa-eye'"
                        @click="toggleShowPassword('new')"
                      ></i>
                    </div>

                    <!-- CONFIRM -->
                    <div class="mb-3 position-relative">
                      <label class="form-label">Xác nhận mật khẩu mới</label>
                      <input
                        :type="showPassword.confirm ? 'text' : 'password'"
                        v-model="passwordForm.confirm"
                        class="form-control"
                      />
                      <i
                        class="fa-solid position-absolute password-toggle"
                        :class="showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'"
                        @click="toggleShowPassword('confirm')"
                      ></i>
                    </div>

                    <!-- Success -->
                    <div v-if="passwordSuccess" class="alert alert-success py-2">
                      {{ passwordSuccess }}
                    </div>

                    <div class="d-flex gap-2">
                      <button
                        class="btn btn-purple text-white"
                        @click="handlePasswordChange"
                        :disabled="passwordLoading"
                      >
                        <i class="fa-solid fa-floppy-disk me-1"></i>
                        {{ passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu' }}
                      </button>

                      <button class="btn btn-outline-secondary" @click="toggleChangePassword">
                        <i class="fa-solid fa-xmark me-1"></i>Huỷ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BORROW -->
        <div class="tab-pane fade" id="borrowing-history">
          <div class="card border-0 shadow-sm p-4 text-center text-muted">Chưa có dữ liệu</div>
        </div>

        <!-- STATISTICS -->
        <div class="tab-pane fade" id="statistics">
          <div class="row g-4">
            <div class="col-md-3" v-for="stat in statCards" :key="stat.label">
              <div class="card border-0 shadow-sm text-center stat-card">
                <div class="card-body">
                  <div
                    class="stat-icon mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    :class="stat.bg"
                    style="width: 80px; height: 80px"
                  >
                    <i :class="stat.icon"></i>
                  </div>

                  <h6 class="text-muted mb-1">{{ stat.label }}</h6>
                  <h2 :class="stat.colorClass + ' fw-bold mb-0'">{{ stat.value }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useProfile from '@/composables/useProfile'
import useToast from '@/composables/useToast'
const { toastSuccess, toastError } = useToast()

// ========================
//  GET DATA FROM COMPOSABLE
// ========================
const { docGia, changePassword, passwordError, passwordSuccess, passwordLoading } = useProfile()

// ========================
//  PASSWORD FORM + LOGIC
// ========================
const showChangePassword = ref(false)
const toggleChangePassword = () => {
  showChangePassword.value = !showChangePassword.value
  passwordError.value = ''
  passwordSuccess.value = ''
}

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

// Show/hide password
const showPassword = ref({
  current: false,
  new: false,
  confirm: false,
})

function toggleShowPassword(field) {
  showPassword.value[field] = !showPassword.value[field]
}

// Submit password change
async function handlePasswordChange() {
  const ok = await changePassword(
    passwordForm.value.current,
    passwordForm.value.new,
    passwordForm.value.confirm,
  )

  if (ok) {
    toastSuccess('Đổi mật khẩu thành công!')
    setTimeout(() => toggleChangePassword(), 800)
  } else {
    toastError(passwordError.value || 'Đổi mật khẩu thất bại!')
  }
}

// ========================
// OTHER UI LOGIC
// ========================
const stats = { dangMuon: 3, chuaTra: 1 }

const memberSince = computed(() => {
  if (!docGia.value?.createdAt) return '—'
  return new Date(docGia.value.createdAt).getFullYear()
})

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN')
}

const statCards = [
  {
    label: 'Tổng đã mượn',
    value: 50,
    icon: 'fa-solid fa-book fs-3 text-purple',
    colorClass: 'text-purple',
    bg: 'bg-purple bg-opacity-10',
  },
  {
    label: 'Trả đúng hạn',
    value: 47,
    icon: 'fa-solid fa-check-circle fs-3 text-success',
    colorClass: 'text-success',
    bg: 'bg-success bg-opacity-10',
  },
  {
    label: 'Trả chậm',
    value: 3,
    icon: 'fa-solid fa-clock fs-3 text-warning',
    colorClass: 'text-warning',
    bg: 'bg-warning bg-opacity-10',
  },
  {
    label: 'Rating trung bình',
    value: '4.8★',
    icon: 'fa-solid fa-star fs-3 text-danger',
    colorClass: 'text-danger',
    bg: 'bg-danger bg-opacity-10',
  },
]
</script>

<style scoped>
.profile-container {
  background: #f8f9fa;
}

.gradient-bg-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-header {
  position: relative;
  overflow: hidden;
  padding-bottom: 3rem;
}

.text-purple {
  color: #667eea !important;
}

.btn-outline-purple {
  color: #667eea;
  border-color: #667eea;
}

.btn-outline-purple:hover {
  background-color: #667eea;
  color: #fff;
}

.btn-purple {
  background-color: #667eea;
  color: white;
}

.btn-purple:hover {
  background-color: #5567d6;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.stat-icon {
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.nav-tabs {
  border-bottom: 2px solid #e0e0e0 !important;
}

.nav-link {
  color: #6c757d !important;
  border-bottom: 3px solid transparent !important;
  transition: all 0.3s ease;
  margin-bottom: -2px;
}

.nav-link:hover {
  color: #667eea !important;
  border-bottom-color: #667eea !important;
}

.nav-link.active {
  color: #667eea !important;
  border-bottom-color: #667eea !important;
  background: none !important;
}

.card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

/* ================================
   ICON MẮT TOGGLE PASSWORD
================================ */
.password-toggle {
  right: 12px;
  top: 65%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.1rem;
  color: #6c757d;
}

.password-toggle:hover {
  color: #333;
}
</style>
