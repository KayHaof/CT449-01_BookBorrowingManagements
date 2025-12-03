<template>
  <AdminModal :title="editData ? 'Sửa thể loại' : 'Thêm thể loại'" @close="$emit('close')">
    <form @submit.prevent="save">
      <AdminFormGroup label="Mã thể loại">
        <input class="form-control" v-model="form.maLoai" required />
      </AdminFormGroup>

      <AdminFormGroup label="Tên thể loại">
        <input class="form-control" v-model="form.tenLoai" required />
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import useCategories from '@/composables/useCategories'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createCategory, updateCategory } = useCategories()

// ⚡ Form mặc định
const defaultForm = {
  maLoai: '',
  tenLoai: '',
}

// ⚡ Reactive form
const form = reactive({ ...defaultForm })

// 🔥 Khi mở modal hoặc edit → load dữ liệu hoặc reset form
watch(
  () => props.editData,
  (v) => {
    // Reset form mỗi khi mở modal
    Object.assign(form, defaultForm)

    // Nếu sửa → đổ dữ liệu vào form
    if (v) {
      form.maLoai = v.maLoai
      form.tenLoai = v.tenLoai
    }
  },
  { immediate: true },
)

const save = async () => {
  try {
    if (props.editData) {
      await updateCategory(props.editData._id, form)
      toast.success('Cập nhật thể loại thành công!')
    } else {
      await createCategory(form)
      toast.success('Thêm thể loại thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Đã xảy ra lỗi!')
  }
}
</script>
