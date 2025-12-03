<template>
  <AdminModal :title="editData ? 'Sửa NXB' : 'Thêm NXB'" @close="$emit('close')">
    <form @submit.prevent="save">
      <AdminFormGroup label="Mã NXB">
        <input class="form-control" v-model="form.maNXB" required />
      </AdminFormGroup>

      <AdminFormGroup label="Tên NXB">
        <input class="form-control" v-model="form.tenNXB" required />
      </AdminFormGroup>

      <AdminFormGroup label="Địa chỉ">
        <textarea class="form-control" v-model="form.diaChi"></textarea>
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import usePublishers from '@/composables/usePublishers'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createPublisher, updatePublisher } = usePublishers()

// ⚡ Form mặc định
const defaultForm = {
  maNXB: '',
  tenNXB: '',
  diaChi: '',
}

// ⚡ Reactive form
const form = reactive({ ...defaultForm })

// 🔥 Load dữ liệu khi sửa hoặc reset khi tạo mới
watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm) // reset form trước

    if (v) {
      form.maNXB = v.maNXB
      form.tenNXB = v.tenNXB
      form.diaChi = v.diaChi
    }
  },
  { immediate: true },
)

const save = async () => {
  try {
    if (props.editData) {
      await updatePublisher(props.editData._id, form)
      toast.success('Cập nhật nhà xuất bản thành công!')
    } else {
      await createPublisher(form)
      toast.success('Thêm nhà xuất bản thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Đã xảy ra lỗi!')
  }
}
</script>
