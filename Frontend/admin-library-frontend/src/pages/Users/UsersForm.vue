<template>
  <AdminModal
    :title="editData ? 'Sửa tài khoản Admin' : 'Thêm tài khoản Admin'"
    @close="$emit('close')"
  >
    <form @submit.prevent="save">
      <!-- Mã ND (chỉ khi tạo mới) -->
      <AdminFormGroup v-if="!editData" label="Mã người dùng">
        <input class="form-control" v-model="form.maND" required />
      </AdminFormGroup>

      <!-- Username -->
      <AdminFormGroup label="Tên đăng nhập">
        <input class="form-control" v-model="form.tenDangNhap" required />
      </AdminFormGroup>

      <!-- Mật khẩu + nút hiện ẩn -->
      <AdminFormGroup label="Mật khẩu">
        <div class="input-group">
          <input
            class="form-control"
            :type="showPass ? 'text' : 'password'"
            v-model="form.matKhau"
            required
          />
          <button class="btn btn-outline-secondary" type="button" @click="togglePass">
            <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>
      </AdminFormGroup>

      <!-- Hidden fields -->
      <input type="hidden" v-model="form.vaiTro" />
      <input type="hidden" v-model="form.refId" />

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
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

// toggle mật khẩu
const showPass = ref(false)
const togglePass = () => (showPass.value = !showPass.value)

// Form mặc định
const form = reactive({
  maND: '',
  tenDangNhap: '',
  matKhau: '',
  vaiTro: 'Admin',
  refId: '',
})

// load dữ liệu khi sửa
watch(
  () => props.editData,
  (v) => {
    if (v) {
      form.maND = v.maND
      form.tenDangNhap = v.tenDangNhap
      form.matKhau = v.matKhau
      form.vaiTro = 'Admin'
      form.refId = ''
    }
  },
)

const save = async () => {
  try {
    if (props.editData) {
      // Sửa admin
      await updateUser(props.editData._id, {
        tenDangNhap: form.tenDangNhap,
        matKhau: form.matKhau,
      })

      toast.success('Cập nhật tài khoản Admin thành công!')
    } else {
      // Tạo admin mới
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
.input-group button {
  border-radius: 0 0.375rem 0.375rem 0 !important;
}
</style>
