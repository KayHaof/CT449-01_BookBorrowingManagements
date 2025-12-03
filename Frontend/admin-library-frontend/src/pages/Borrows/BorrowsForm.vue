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
        <input type="date" class="form-control" v-model="form.ngayMuon" required />
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
const emit = defineEmits(['close', 'saved', 'create-fine'])

const { createBorrow, updateBorrow } = useBorrows()

const defaultForm = {
  maMuon: '',
  maDocGia: '',
  maSach: '',
  ngayMuon: '',
  ngayTra: '',
  trangThai: 'dang_muon',
}

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

// Auto set ngày trả cho “đã trả” hoặc “trễ hạn”
watch(
  () => form.trangThai,
  (value) => {
    if (value === 'da_tra' || value === 'tre_han') {
      if (!form.ngayTra) {
        form.ngayTra = new Date().toISOString().substring(0, 10)
      }
    } else {
      form.ngayTra = ''
    }
  },
)

const save = async () => {
  try {
    let updated

    if (props.editData) {
      updated = await updateBorrow(props.editData._id, form)
      console.log(updated)

      toast.success('Cập nhật thành công!')
    } else {
      updated = await createBorrow(form)
      toast.success('Tạo phiếu mới!')
    }

    // Tạo phiếu phạt nếu trễ hạn
    if (form.trangThai === 'tre_han') {
      const borrow = updated.borrow // <-- lấy đúng object trả về từ server

      emit('create-fine', {
        maMuonSach: borrow._id,
        ngayMuon: borrow.ngayMuon,
        ngayTra: borrow.ngayTra,
      })
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Có lỗi xảy ra!')
  }
}
</script>
