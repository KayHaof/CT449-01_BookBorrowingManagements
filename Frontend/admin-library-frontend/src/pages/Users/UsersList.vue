<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h3 class="fw-bold"><i class="fa-solid fa-users text-info"></i> Tài khoản Quản trị viên</h3>
      <button class="btn btn-primary" @click="openForm()">+ Thêm tài khoản</button>
    </div>

    <!-- TABLE -->
    <AdminTable :columns="columns" :rows="pagedUsers" @edit="openForm" @delete="askDelete" />

    <!-- PAGINATION -->
    <Pagination
      :currentPage="currentPage"
      :totalItems="users.length"
      :itemsPerPage="itemsPerPage"
      @page-change="changePage"
    />

    <!-- FORM -->
    <UsersForm v-if="showForm" :editData="editing" @close="closeForm" @saved="loadUsers" />

    <!-- CONFIRM DELETE -->
    <ConfirmModal
      v-if="showConfirm"
      title="Xóa tài khoản?"
      :message="`Bạn có chắc chắn muốn xóa tài khoản: ${deletingItem?.tenDangNhap}? Hành động này không thể hoàn tác.`"
      @close="showConfirm = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import AdminTable from '@/components/AdminTable.vue'
import Pagination from '@/components/Pagination.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import UsersForm from './UsersForm.vue'

import useUsers from '@/composables/useUsers'
import { toast } from '@/utils/toast'

const { getUsers, deleteUser } = useUsers()

const users = ref([])

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5

// Form
const showForm = ref(false)
const editing = ref(null)

// Delete modal
const showConfirm = ref(false)
const deletingItem = ref(null)

const columns = [
  { key: 'maND', label: 'Mã ND' },
  { key: 'tenDangNhap', label: 'Tên đăng nhập' },
  { key: 'vaiTro', label: 'Vai trò' },
]

/* ========= PAGINATION ========= */
const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return users.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

/* ========= LOAD DATA ========= */
const loadUsers = async () => {
  const all = await getUsers()
  users.value = all.filter((u) => u.vaiTro === 'Admin')
}

/* ========= FORM ========= */
const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

/* ========= DELETE ========= */
const askDelete = (row) => {
  deletingItem.value = row
  showConfirm.value = true
}

const confirmDelete = async () => {
  await deleteUser(deletingItem.value._id)
  toast.success('Xóa tài khoản thành công!')
  showConfirm.value = false
  loadUsers()
}

onMounted(loadUsers)
</script>
