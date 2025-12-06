<template>
  <AdminModal
    :title="editData ? 'Sửa tài khoản Admin' : 'Thêm tài khoản Admin'"
    @close="$emit('close')"
  >
    <form @submit.prevent="save" class="admin-user-form">
      <!-- Mã ND (chỉ khi tạo) -->
      <AdminFormGroup v-if="!editData" label="Mã người dùng">
        <input class="form-control styled-input" v-model="form.maND" required />
      </AdminFormGroup>

      <!-- Username -->
      <AdminFormGroup label="Tên đăng nhập">
        <input class="form-control styled-input" v-model="form.tenDangNhap" required />
      </AdminFormGroup>

      <!-- Mật khẩu -->
      <AdminFormGroup label="Mật khẩu">
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

      <!-- Hidden fields -->
      <input type="hidden" v-model="form.vaiTro" />
      <input type="hidden" v-model="form.refId" />

      <button class="btn-submit w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import useUsers from '@/composables/useUsers'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createUser, updateUser } = useUsers()

const showPass = ref(false)
const togglePass = () => (showPass.value = !showPass.value)

const form = reactive({
  maND: '',
  tenDangNhap: '',
  matKhau: '',
  vaiTro: 'Admin',
  refId: null,
})

watch(
  () => props.editData,
  (v) => {
    if (v) {
      form.maND = v.maND
      form.tenDangNhap = v.tenDangNhap
      form.matKhau = v.matKhau
      form.vaiTro = 'Admin'
      form.refId = null
    }
  },
)

const save = async () => {
  try {
    if (props.editData) {
      await updateUser(props.editData._id, {
        tenDangNhap: form.tenDangNhap,
        matKhau: form.matKhau,
      })

      toast.success('Cập nhật tài khoản Admin thành công!')
    } else {
      await createUser(form)
      toast.success('Tạo tài khoản Admin thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Có lỗi xảy ra!')
  }
}
</script>

<style scoped>
.admin-user-form {
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

/* Input khi nằm trong input-group */
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

/* ===== BUTTON SUBMIT ===== */
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
