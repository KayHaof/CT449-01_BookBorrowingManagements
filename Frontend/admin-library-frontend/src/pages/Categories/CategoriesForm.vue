<template>
  <AdminModal :title="editData ? 'Sửa thể loại' : 'Thêm thể loại'" @close="$emit('close')">
    <form @submit.prevent="save" class="category-form">
      <AdminFormGroup label="Mã thể loại">
        <input class="form-control styled-input" v-model="form.maLoai" required />
      </AdminFormGroup>

      <AdminFormGroup label="Tên thể loại">
        <input class="form-control styled-input" v-model="form.tenLoai" required />
      </AdminFormGroup>

      <button class="btn-submit w-100 mt-3">Lưu</button>
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

const defaultForm = {
  maLoai: '',
  tenLoai: '',
}

const form = reactive({ ...defaultForm })

watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm)

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
<style scoped>
.category-form {
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
