<template>
  <AdminModal :title="editData ? 'Sửa phiếu phạt' : 'Tạo phiếu phạt'" @close="$emit('close')">
    <form @submit.prevent="save">
      <AdminFormGroup label="Mã phiếu phạt">
        <input class="form-control" v-model="form.maPhieuPhat" required />
      </AdminFormGroup>

      <AdminFormGroup label="Nhân viên lập (ID)">
        <input class="form-control" v-model="form.maNVLap" required />
      </AdminFormGroup>

      <AdminFormGroup label="Phiếu mượn (ID)">
        <input class="form-control" v-model="form.maMuonSach" required />
      </AdminFormGroup>

      <AdminFormGroup label="Số tiền">
        <input type="number" class="form-control" v-model="form.soTien" required />
      </AdminFormGroup>

      <AdminFormGroup label="Lý do">
        <textarea class="form-control" v-model="form.lyDo"></textarea>
      </AdminFormGroup>

      <AdminFormGroup label="Ngày lập">
        <input type="date" class="form-control" v-model="form.ngayLap" />
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
    </form>
  </AdminModal>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import AdminModal from '@/components/AdminModal.vue'
import AdminFormGroup from '@/components/AdminFormGroup.vue'
import useFines from '@/composables/useFines'
import { toast } from '@/utils/toast'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createFine, updateFine } = useFines()

const defaultForm = {
  maPhieuPhat: '',
  maNVLap: '',
  maMuonSach: '',
  soTien: '',
  lyDo: '',
  ngayLap: '',
}

const form = reactive({ ...defaultForm })

const isEdit = computed(() => props.editData && props.editData._id)

// 🔥 LOAD DATA KHI SỬA
watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm)
    console.log(v)
    if (v && v._id) {
      // Mode Sửa
      form.maPhieuPhat = v.maPhieuPhat
      form.maNVLap = v.maNVLap?._id || v.maNVLap
      form.maMuonSach = v.maMuonSach?._id || v.maMuonSach
      form.soTien = v.soTien
      form.lyDo = v.lyDo
      form.ngayLap = v.ngayLap ? v.ngayLap.substring(0, 10) : ''
    } else if (v) {
      // Mode Tạo từ BorrowPage
      form.maPhieuPhat = v.maPhieuPhat
      form.maNVLap = v.maNVLap
      form.maMuonSach = v.maMuonSach
      form.soTien = v.soTien
      form.lyDo = v.lyDo
      form.ngayLap = v.ngayLap
    }
  },
  { immediate: true },
)

const save = async () => {
  try {
    if (isEdit.value) {
      await updateFine(props.editData._id, form)
      toast.success('Cập nhật phiếu phạt thành công!')
    } else {
      await createFine(form)
      toast.success('Tạo phiếu phạt thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err.message || 'Lỗi xảy ra!')
  }
}
</script>
