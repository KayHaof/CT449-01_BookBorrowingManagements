<template>
  <AdminModal :title="editData ? 'Sửa phiếu mượn' : 'Tạo phiếu mượn'" @close="$emit('close')">
    <form @submit.prevent="save">
      <AdminFormGroup label="Mã phiếu mượn">
        <input class="form-control" v-model="form.maMuon" required />
      </AdminFormGroup>

      <AdminFormGroup label="Độc giả (ID)">
        <input class="form-control" v-model="form.maDocGia" required />
      </AdminFormGroup>

      <AdminFormGroup label="Sách (ID)">
        <input class="form-control" v-model="form.maSach" required />
      </AdminFormGroup>

      <AdminFormGroup label="Ngày mượn">
        <input type="date" class="form-control" v-model="form.ngayMuon" />
      </AdminFormGroup>

      <AdminFormGroup label="Ngày trả">
        <input type="date" class="form-control" v-model="form.ngayTra" />
      </AdminFormGroup>

      <AdminFormGroup label="Trạng thái">
        <select class="form-control" v-model="form.trangThai">
          <option value="dang_ky_muon">Đang đăng ký mượn</option>
          <option value="dang_muon">Đang mượn</option>
          <option value="da_tra">Đã trả</option>
          <option value="tre_han">Trễ hạn</option>
        </select>
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import useBorrows from '@/composables/useBorrows'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createBorrow, updateBorrow } = useBorrows()

// ⚡ Form mặc định
const defaultForm = {
  maMuon: '',
  maDocGia: '',
  maSach: '',
  ngayMuon: '',
  ngayTra: '',
  trangThai: 'dang_muon',
}

// ⚡ Reactive form
const form = reactive({ ...defaultForm })

watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm)

    if (v) {
      form.maMuon = v.maMuon
      form.maDocGia = v.maDocGia?._id
      form.maSach = v.maSach?._id

      form.ngayMuon = v.ngayMuon ? v.ngayMuon.substring(0, 10) : ''
      form.ngayTra = v.ngayTra ? v.ngayTra.substring(0, 10) : ''

      form.trangThai = v.trangThai
    }
  },
  { immediate: true },
)

// ⭐ Tự động xử lý ngày trả theo trạng thái
watch(
  () => form.trangThai,
  (value) => {
    if (value === 'da_tra') {
      // Nếu chuyển sang đã trả → set ngày trả = hôm nay
      form.ngayTra = new Date().toISOString().substring(0, 10)
    } else {
      // Nếu chuyển về trạng thái khác → reset ngày trả
      form.ngayTra = ''
    }
  },
)

const save = async () => {
  try {
    if (props.editData) {
      await updateBorrow(props.editData._id, form)
      toast.success('Cập nhật phiếu mượn thành công!')
    } else {
      await createBorrow(form)
      toast.success('Tạo phiếu mượn thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Có lỗi xảy ra, vui lòng thử lại!')
  }
}
</script>
