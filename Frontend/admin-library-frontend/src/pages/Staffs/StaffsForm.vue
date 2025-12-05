<template>
  <AdminModal :title="editData ? 'Sửa nhân viên' : 'Thêm nhân viên'" @close="$emit('close')">
    <form @submit.prevent="save" class="staff-form">
      <!-- Mã NV -->
      <AdminFormGroup label="Mã nhân viên">
        <input class="form-control styled-input" v-model="form.maNV" required />
      </AdminFormGroup>

      <!-- Họ tên -->
      <AdminFormGroup label="Họ tên nhân viên">
        <input class="form-control styled-input" v-model="form.hoTenNV" required />
      </AdminFormGroup>

      <!-- Username (chỉ khi tạo) -->
      <AdminFormGroup v-if="!editData" label="Tên đăng nhập">
        <input class="form-control styled-input" v-model="form.tenDangNhap" required />
      </AdminFormGroup>

      <!-- Mật khẩu -->
      <AdminFormGroup v-if="!editData" label="Mật khẩu">
        <div class="input-group gradient-input-group">
          <input
            class="form-control styled-input no-right-radius"
            :type="showPass ? 'text' : 'password'"
            v-model="form.matKhau"
            required
          />
          <button class="btn toggle-btn" type="button" @click="togglePass">
            <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>
      </AdminFormGroup>

      <!-- Khi sửa mật khẩu -->
      <AdminFormGroup v-else label="Mật khẩu (để trống nếu không đổi)">
        <div class="input-group gradient-input-group">
          <input
            class="form-control styled-input no-right-radius"
            :type="showPass ? 'text' : 'password'"
            v-model="form.matKhau"
            placeholder="••••••"
          />
          <button class="btn toggle-btn" type="button" @click="togglePass">
            <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>
      </AdminFormGroup>

      <!-- Chức vụ -->
      <AdminFormGroup label="Chức vụ">
        <input class="form-control styled-input" v-model="form.chucVu" />
      </AdminFormGroup>

      <!-- Địa chỉ -->
      <AdminFormGroup label="Địa chỉ">
        <input class="form-control styled-input" v-model="form.diaChi" />
      </AdminFormGroup>

      <!-- SĐT -->
      <AdminFormGroup label="Số điện thoại">
        <input class="form-control styled-input" v-model="form.soDienThoai" />
      </AdminFormGroup>

      <button class="btn-submit w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import useStaffs from '@/composables/useStaffs'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createFullStaff, updateStaff } = useStaffs()

const showPass = ref(false)
const togglePass = () => (showPass.value = !showPass.value)

// Form mặc định
const form = reactive({
  maNV: '',
  hoTenNV: '',
  matKhau: '',
  tenDangNhap: '',
  chucVu: '',
  diaChi: '',
  soDienThoai: '',
})

// Load dữ liệu khi sửa
watch(
  () => props.editData,
  (v) => {
    if (v) {
      Object.assign(form, v)
      form.matKhau = ''
      form.tenDangNhap = v.tenDangNhap ?? ''
    } else {
      Object.keys(form).forEach((k) => (form[k] = ''))
    }
  },
  { immediate: true },
)

const save = async () => {
  try {
    if (props.editData) {
      const payload = { ...form }
      if (!payload.matKhau) delete payload.matKhau

      await updateStaff(props.editData._id, payload)
      toast.success('Cập nhật nhân viên thành công!')
    } else {
      await createFullStaff(form)
      toast.success('Thêm nhân viên thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Có lỗi xảy ra!')
  }
}
</script>

<style scoped>
.staff-form {
  padding: 10px 2px;
}

/* ===== INPUT ===== */
.styled-input {
  border: 1.5px solid #c8b6ff;
  border-radius: 10px;
  padding: 10px 14px;
  transition: 0.25s;
}

.styled-input:focus {
  border-color: #7b5cff;
  box-shadow: 0 0 6px rgba(123, 92, 255, 0.35);
}

/* Khi nằm trong input-group, tránh bo góc bị đúp */
.no-right-radius {
  border-right: none !important;
  border-radius: 10px 0 0 10px !important;
}

/* ===== BUTTON HIỆN/ẨN MẬT KHẨU ===== */
.gradient-input-group .toggle-btn {
  border-radius: 0 10px 10px 0 !important;
  background: linear-gradient(135deg, #7b5cff, #5ac8fa);
  color: white;
  border: none;
  padding: 0 14px;
  transition: 0.25s;
}

.gradient-input-group .toggle-btn:hover {
  opacity: 0.9;
}

/* ===== BUTTON LƯU ===== */
.btn-submit {
  background: linear-gradient(135deg, #7b5cff, #5ac8fa);
  border: none;
  padding: 12px;
  font-size: 17px;
  font-weight: 600;
  border-radius: 10px;
  color: white;
  transition: 0.25s;
}

.btn-submit:hover {
  opacity: 0.92;
  box-shadow: 0 4px 14px rgba(123, 92, 255, 0.35);
}
</style>
