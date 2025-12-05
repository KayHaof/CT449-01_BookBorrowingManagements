<template>
  <AdminModal :title="editData ? 'Sửa độc giả' : 'Thêm độc giả'" @close="$emit('close')">
    <form @submit.prevent="save" class="reader-form">
      <AdminFormGroup label="Mã độc giả">
        <input class="form-control styled-input" v-model="form.maDocGia" required />
      </AdminFormGroup>

      <AdminFormGroup label="Họ lót">
        <input class="form-control styled-input" v-model="form.hoLot" required />
      </AdminFormGroup>

      <AdminFormGroup label="Tên">
        <input class="form-control styled-input" v-model="form.ten" required />
      </AdminFormGroup>

      <AdminFormGroup label="Giới tính">
        <select class="form-control styled-input" v-model="form.phai">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </AdminFormGroup>

      <AdminFormGroup label="Ngày sinh">
        <input type="date" class="form-control styled-input" v-model="form.ngaySinh" />
      </AdminFormGroup>

      <AdminFormGroup label="Địa chỉ">
        <input class="form-control styled-input" v-model="form.diaChi" />
      </AdminFormGroup>

      <AdminFormGroup label="Điện thoại">
        <input class="form-control styled-input" v-model="form.dienThoai" />
      </AdminFormGroup>

      <button class="btn-submit w-100 mt-3">Lưu</button>
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

const defaultForm = {
  maDocGia: '',
  hoLot: '',
  ten: '',
  phai: 'Nam',
  ngaySinh: '',
  diaChi: '',
  dienThoai: '',
}

const form = reactive({ ...defaultForm })

watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm)

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
<style scoped>
.reader-form {
  padding: 10px 2px;
}

/* ===== INPUT & SELECT ===== */
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
