<template>
  <div class="profile-container min-vh-100 d-flex flex-column">
    <!-- Header -->
    <div class="profile-header gradient-bg-purple pb-5">
      <div class="container pt-4">
        <div class="row align-items-end g-4">
          <div class="col-md">
            <h1 class="display-5 text-white fw-bold mb-2">{{ docGia?.hoLot }} {{ docGia?.ten }}</h1>

            <p class="text-white-50 fs-5 mb-1">Độc giả • Thành viên từ {{ memberSince }}</p>

            <div class="d-flex gap-3 mt-3">
              <span class="badge bg-info text-dark fs-6">
                {{ stats.dangMuon }} sách đang mượn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN -->
    <div class="container my-5 flex-grow-1">
      <!-- TABS -->
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
            <!-- LEFT: PROFILE DETAILS -->
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-light border-bottom">
                  <h5 class="mb-0 text-purple fw-bold">
                    <i class="fa-solid fa-circle-info me-2"></i>
                    Thông tin cá nhân
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

            <!-- RIGHT: SETTINGS -->
            <div class="col-lg-6">
              <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-light border-bottom">
                  <h5 class="mb-0 text-purple fw-bold">
                    <i class="fa-solid fa-gear me-2"></i>
                    Cài đặt tài khoản
                  </h5>
                </div>

                <div class="card-body">
                  <!-- ACTION BUTTONS -->
                  <div
                    v-if="!showChangePassword && !showEditProfile"
                    class="d-flex justify-content-between mb-4"
                  >
                    <div>
                      <h6 class="fw-bold mb-2">Đổi mật khẩu</h6>
                      <button class="btn btn-outline-purple btn-sm" @click="openPasswordForm">
                        <i class="fa-solid fa-key me-1"></i> Đổi mật khẩu
                      </button>
                    </div>

                    <div class="text-end">
                      <h6 class="fw-bold mb-2">Thông tin cá nhân</h6>
                      <button class="btn btn-outline-purple btn-sm" @click="openEditProfile">
                        <i class="fa-solid fa-pen-to-square me-1"></i>
                        Cập nhật thông tin
                      </button>
                    </div>
                  </div>

                  <!-- FORM ĐỔI MẬT KHẨU -->
                  <div v-if="showChangePassword">
                    <h6 class="fw-bold mb-3 text-purple">Đổi mật khẩu</h6>

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

                    <div class="d-flex gap-2 mt-3">
                      <button
                        class="btn btn-purple text-white"
                        @click="handlePasswordChange"
                        :disabled="passwordLoading"
                      >
                        <i class="fa-solid fa-floppy-disk me-1"></i>
                        {{ passwordLoading ? 'Đang lưu...' : 'Lưu mật khẩu' }}
                      </button>

                      <button class="btn btn-outline-secondary" @click="closePasswordForm">
                        <i class="fa-solid fa-xmark me-1"></i>Huỷ
                      </button>
                    </div>
                  </div>

                  <!-- FORM CẬP NHẬT THÔNG TIN -->
                  <div v-if="showEditProfile" class="mt-4">
                    <h6 class="fw-bold mb-3 text-purple">Chỉnh sửa thông tin</h6>

                    <div class="row g-3">
                      <div class="col-6">
                        <label class="form-label">Họ lót</label>
                        <input v-model="editForm.hoLot" class="form-control" />
                      </div>

                      <div class="col-6">
                        <label class="form-label">Tên</label>
                        <input v-model="editForm.ten" class="form-control" />
                      </div>

                      <div class="col-6">
                        <label class="form-label">Ngày sinh</label>
                        <input type="date" v-model="editForm.ngaySinh" class="form-control" />
                      </div>

                      <div class="col-6">
                        <label class="form-label">Giới tính</label>
                        <select v-model="editForm.phai" class="form-select">
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                        </select>
                      </div>

                      <div class="col-12">
                        <label class="form-label">Số điện thoại</label>
                        <input v-model="editForm.dienThoai" class="form-control" />
                      </div>

                      <div class="col-12">
                        <label class="form-label">Địa chỉ</label>
                        <textarea
                          v-model="editForm.diaChi"
                          rows="2"
                          class="form-control"
                        ></textarea>
                      </div>
                    </div>

                    <div class="d-flex gap-2 mt-3">
                      <button
                        class="btn btn-purple text-white"
                        @click="handleUpdateProfile"
                        :disabled="editLoading"
                      >
                        <i class="fa-solid fa-floppy-disk me-1"></i>
                        {{ editLoading ? 'Đang lưu...' : 'Lưu thay đổi' }}
                      </button>

                      <button class="btn btn-outline-secondary" @click="closeEditProfile">
                        <i class="fa-solid fa-xmark me-1"></i>Huỷ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
import { toast } from '@/utils/toast'

const {
  docGia,
  stats,
  changePassword,
  updateProfile,
  passwordError,
  passwordSuccess,
  passwordLoading,
} = useProfile()

const showChangePassword = ref(false)
const showEditProfile = ref(false)

const editForm = ref({
  hoLot: '',
  ten: '',
  ngaySinh: '',
  phai: '',
  dienThoai: '',
  diaChi: '',
})

const editLoading = ref(false)

function openEditProfile() {
  if (showChangePassword.value) showChangePassword.value = false
  showEditProfile.value = true

  editForm.value = {
    hoLot: docGia.value.hoLot,
    ten: docGia.value.ten,
    ngaySinh: docGia.value.ngaySinh?.slice(0, 10),
    phai: docGia.value.phai,
    dienThoai: docGia.value.dienThoai,
    diaChi: docGia.value.diaChi,
  }
}

function closeEditProfile() {
  showEditProfile.value = false
}

function openPasswordForm() {
  if (showEditProfile.value) showEditProfile.value = false
  showChangePassword.value = true
}

function closePasswordForm() {
  showChangePassword.value = false
  passwordError.value = ''
  passwordSuccess.value = ''
}

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const showPassword = ref({
  current: false,
  new: false,
  confirm: false,
})

function toggleShowPassword(f) {
  showPassword.value[f] = !showPassword.value[f]
}

async function handlePasswordChange() {
  const ok = await changePassword(
    passwordForm.value.current,
    passwordForm.value.new,
    passwordForm.value.confirm,
  )

  if (ok) {
    toast.success('Đổi mật khẩu thành công!')
    closePasswordForm()
  } else {
    toast.error(passwordError.value || 'Đổi mật khẩu thất bại!')
  }
}

async function handleUpdateProfile() {
  editLoading.value = true

  const ok = await updateProfile(editForm.value)

  editLoading.value = false

  if (ok) {
    toast.success('Cập nhật thông tin thành công!')
    closeEditProfile()
  } else {
    toast.error('Không thể cập nhật thông tin!')
  }
}

// --- OTHER LOGIC ---
const memberSince = computed(() => {
  if (!docGia.value?.createdAt) return '—'
  return new Date(docGia.value.createdAt).getFullYear()
})

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('vi-VN')
}

const statCards = computed(() => [
  {
    label: 'Tổng đã mượn',
    value: stats.value.tongMuon,
    icon: 'fa-solid fa-book fs-3 text-purple',
    colorClass: 'text-purple',
    bg: 'bg-purple bg-opacity-10',
  },
  {
    label: 'Đang mượn',
    value: stats.value.dangMuon,
    icon: 'fa-solid fa-book-open-reader fs-3 text-info',
    colorClass: 'text-info',
    bg: 'bg-info bg-opacity-10',
  },
  {
    label: 'Chưa trả',
    value: stats.value.chuaTra ?? stats.value.dangMuon,
    icon: 'fa-solid fa-clock-rotate-left fs-3 text-secondary',
    colorClass: 'text-secondary',
    bg: 'bg-secondary bg-opacity-10',
  },
  {
    label: 'Trả đúng hạn',
    value: stats.value.traDungHan,
    icon: 'fa-solid fa-circle-check fs-3 text-success',
    colorClass: 'text-success',
    bg: 'bg-success bg-opacity-10',
  },
  {
    label: 'Trả trễ hạn',
    value: stats.value.traTre,
    icon: 'fa-solid fa-triangle-exclamation fs-3 text-warning',
    colorClass: 'text-warning',
    bg: 'bg-warning bg-opacity-10',
  },
  {
    label: 'Tổng tiền phạt',
    value: stats.value.tongTienPhat.toLocaleString('vi-VN') + 'đ',
    icon: 'fa-solid fa-money-bill fs-3 text-danger',
    colorClass: 'text-danger',
    bg: 'bg-danger bg-opacity-10',
  },
  {
    label: 'Số phiếu phạt',
    value: stats.value.soPhieuPhat,
    icon: 'fa-solid fa-receipt fs-3 text-primary',
    colorClass: 'text-primary',
    bg: 'bg-primary bg-opacity-10',
  },
  {
    label: 'Tỷ lệ đúng hạn (%)',
    value: stats.value.tiLeDungHan + '%',
    icon: 'fa-solid fa-percent fs-3 text-dark',
    colorClass: 'text-dark',
    bg: 'bg-dark bg-opacity-10',
  },
])
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
