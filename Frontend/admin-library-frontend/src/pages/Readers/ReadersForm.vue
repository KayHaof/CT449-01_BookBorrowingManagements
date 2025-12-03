<template>
  <AdminModal :title="editData ? 'Sửa độc giả' : 'Thêm độc giả'" @close="$emit('close')">
    <form @submit.prevent="save">
      <AdminFormGroup label="Mã độc giả">
        <input class="form-control" v-model="form.maDocGia" required />
      </AdminFormGroup>

      <AdminFormGroup label="Họ lót">
        <input class="form-control" v-model="form.hoLot" required />
      </AdminFormGroup>

      <AdminFormGroup label="Tên">
        <input class="form-control" v-model="form.ten" required />
      </AdminFormGroup>

      <AdminFormGroup label="Giới tính">
        <select class="form-control" v-model="form.phai">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </AdminFormGroup>

      <AdminFormGroup label="Ngày sinh">
        <input type="date" class="form-control" v-model="form.ngaySinh" />
      </AdminFormGroup>

      <AdminFormGroup label="Địa chỉ">
        <input class="form-control" v-model="form.diaChi" />
      </AdminFormGroup>

      <AdminFormGroup label="Điện thoại">
        <input class="form-control" v-model="form.dienThoai" />
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import useReaders from '@/composables/useReaders'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createReader, updateReader } = useReaders()

// ⚡ Form mặc định
const defaultForm = {
  maDocGia: '',
  hoLot: '',
  ten: '',
  phai: 'Nam',
  ngaySinh: '',
  diaChi: '',
  dienThoai: '',
}

// ⚡ Reactive form
const form = reactive({ ...defaultForm })

// 🔥 Load dữ liệu khi sửa hoặc reset khi thêm mới
watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm) // reset form

    if (v) {
      form.maDocGia = v.maDocGia
      form.hoLot = v.hoLot
      form.ten = v.ten
      form.phai = v.phai
      form.ngaySinh = v.ngaySinh?.substring(0, 10) ?? ''
      form.diaChi = v.diaChi
      form.dienThoai = v.dienThoai
    }
  },
  { immediate: true },
)

const save = async () => {
  try {
    if (props.editData) {
      await updateReader(props.editData._id, form)
      toast.success('Cập nhật độc giả thành công!')
    } else {
      await createReader(form)
      toast.success('Thêm độc giả thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Đã xảy ra lỗi!')
  }
}
</script>
