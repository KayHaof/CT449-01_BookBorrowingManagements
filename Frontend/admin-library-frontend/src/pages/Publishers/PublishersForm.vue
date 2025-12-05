<template>
  <AdminModal :title="editData ? 'Sửa NXB' : 'Thêm NXB'" @close="$emit('close')">
    <form @submit.prevent="save" class="publisher-form">
      <AdminFormGroup label="Mã NXB">
        <input class="form-control styled-input" v-model="form.maNXB" required />
      </AdminFormGroup>

      <AdminFormGroup label="Tên NXB">
        <input class="form-control styled-input" v-model="form.tenNXB" required />
      </AdminFormGroup>

      <button class="btn-submit w-100 mt-3">Lưu</button>
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

const defaultForm = {
  maNXB: '',
  tenNXB: '',
}

const form = reactive({ ...defaultForm })

watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm)
    if (v) {
      form.maNXB = v.maNXB
      form.tenNXB = v.tenNXB
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
<style scoped>
.publisher-form {
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
