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

const currentPage = ref(1)
const itemsPerPage = 5
const showForm = ref(false)
const editing = ref(null)

const showConfirm = ref(false)
const deletingItem = ref(null)

const columns = [
  { key: 'maND', label: 'Mã ND' },
  { key: 'tenDangNhap', label: 'Tên đăng nhập' },
  { key: 'vaiTro', label: 'Vai trò' },
]

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return users.value.slice(start, start + itemsPerPage)
})

const changePage = (p) => {
  currentPage.value = p
}

const loadUsers = async () => {
  const all = await getUsers()
  users.value = all.filter((u) => u.vaiTro === 'Admin')
}

const openForm = (row = null) => {
  editing.value = row
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
}

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
<style scoped>
h3.fw-bold {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #4b4b4b;
}

h3.fw-bold i {
  font-size: 24px;
  background: linear-gradient(135deg, #7b5cff, #5ac8fa);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

button.btn-primary {
  background: linear-gradient(135deg, #7b5cff, #5ac8fa) !important;
  border: none !important;
  padding: 10px 18px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  color: white;
  transition: all 0.25s ease;
  box-shadow: 0 3px 8px rgba(123, 92, 255, 0.28);
}

button.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(123, 92, 255, 0.35);
  opacity: 0.95;
}

button.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 3px 10px rgba(123, 92, 255, 0.25);
  opacity: 0.9;
}
</style>
