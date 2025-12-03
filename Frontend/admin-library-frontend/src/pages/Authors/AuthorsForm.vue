<template>
  <AdminModal :title="editData ? 'Sửa tác giả' : 'Thêm tác giả'" @close="$emit('close')">
    <form @submit.prevent="save">
      <AdminFormGroup label="Mã tác giả">
        <input class="form-control" v-model="form.maTacGia" required />
      </AdminFormGroup>

      <AdminFormGroup label="Họ tên">
        <input class="form-control" v-model="form.hoTen" required />
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import useAuthors from '@/composables/useAuthors'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createAuthor, updateAuthor } = useAuthors()

// ⚡ Default form
const defaultForm = {
  maTacGia: '',
  hoTen: '',
}

// ⚡ Reactive form
const form = reactive({ ...defaultForm })

// 🔥 Khi mở modal → load hoặc reset form
watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm)

    if (v) {
      form.maTacGia = v.maTacGia
      form.hoTen = v.hoTen
    }
  },
  { immediate: true },
)

const save = async () => {
  try {
    if (props.editData) {
      await updateAuthor(props.editData._id, form)
      toast.success('Cập nhật tác giả thành công!')
    } else {
      await createAuthor(form)
      toast.success('Thêm tác giả thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Có lỗi xảy ra khi xử lý dữ liệu!')
  }
}
</script>
