<template>
  <AdminModal :title="editData ? 'Sửa nhân viên' : 'Thêm nhân viên'" @close="$emit('close')">
    <form @submit.prevent="save">
      <!-- Mã NV -->
      <AdminFormGroup label="Mã nhân viên">
        <input class="form-control" v-model="form.maNV" required />
      </AdminFormGroup>

      <!-- Họ tên -->
      <AdminFormGroup label="Họ tên nhân viên">
        <input class="form-control" v-model="form.hoTenNV" required />
      </AdminFormGroup>

      <!-- Username (chỉ khi tạo mới) -->
      <AdminFormGroup v-if="!editData" label="Tên đăng nhập">
        <input class="form-control" v-model="form.tenDangNhap" required />
      </AdminFormGroup>

      <!-- Mật khẩu -->
      <AdminFormGroup v-if="!editData" label="Mật khẩu">
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

      <AdminFormGroup v-else label="Mật khẩu (để trống nếu không đổi)">
        <div class="input-group">
          <input
            class="form-control"
            :type="showPass ? 'text' : 'password'"
            v-model="form.matKhau"
            placeholder="••••••"
          />
          <button class="btn btn-outline-secondary" type="button" @click="togglePass">
            <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>
      </AdminFormGroup>

      <!-- Chức vụ -->
      <AdminFormGroup label="Chức vụ">
        <input class="form-control" v-model="form.chucVu" />
      </AdminFormGroup>

      <!-- Địa chỉ -->
      <AdminFormGroup label="Địa chỉ">
        <input class="form-control" v-model="form.diaChi" />
      </AdminFormGroup>

      <!-- SĐT -->
      <AdminFormGroup label="Số điện thoại">
        <input class="form-control" v-model="form.soDienThoai" />
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
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
.input-group button {
  border-radius: 0 0.375rem 0.375rem 0 !important;
}
</style>
