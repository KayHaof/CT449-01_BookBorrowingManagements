<template>
  <AdminModal title="Thông tin độc giả" @close="$emit('close')">
    <div class="p-3">
      <div class="card shadow-sm border-0 p-3 rounded-4">
        <h5 class="fw-bold mb-3 text-primary">{{ reader.hoLot }} {{ reader.ten }}</h5>

        <p><strong>Mã Độc Giả:</strong> {{ reader.maDocGia }}</p>
        <p><strong>Giới tính:</strong> {{ reader.phai }}</p>
        <p>
          <strong>Ngày sinh:</strong>
          {{ reader.ngaySinh ? reader.ngaySinh.substring(0, 10) : '—' }}
        </p>
        <p><strong>Địa chỉ:</strong> {{ reader.diaChi || '—' }}</p>
        <p><strong>Điện thoại:</strong> {{ reader.dienThoai || '—' }}</p>
      </div>

      <button class="btn btn-secondary w-100 mt-3" @click="$emit('close')">Đóng</button>
    </div>
  </AdminModal>
</template>

<script setup>
import AdminModal from '@/components/AdminModal.vue'

defineProps({
  reader: {
    type: Object,
    required: true,
  },
})
</script>
