<template>
  <div class="admin-sidebar">
    <h3 class="sidebar-title">Admin Panel</h3>

    <ul class="sidebar-menu">
      <li v-for="item in menu" :key="item.to">
        <router-link :to="item.to">
          {{ item.label }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// MENU CHO ADMIN
const adminMenu = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Quản lý Sách', to: '/admin/books' },
  { label: 'Tác Giả', to: '/admin/authors' },
  { label: 'Thể Loại', to: '/admin/categories' },
  { label: 'Nhà Xuất Bản', to: '/admin/publishers' },
  { label: 'Độc Giả', to: '/admin/readers' },
  { label: 'Nhân Viên', to: '/admin/staffs' },
  { label: 'Phiếu Mượn', to: '/admin/borrows' },
  { label: 'Phiếu Phạt', to: '/admin/fines' },
  { label: 'User Hệ Thống', to: '/admin/users' },
]

// MENU CHO NHÂN VIÊN
const staffMenu = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Phiếu Mượn', to: '/admin/borrows' },
  { label: 'Phiếu Phạt', to: '/admin/fines' },
]

// MENU THEO VAI TRÒ
const menu = computed(() => {
  if (!auth.user) return []

  return auth.user.vaiTro === 'Admin' ? adminMenu : staffMenu
})
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  min-height: 100vh;
  padding: 25px 20px;
  background: linear-gradient(160deg, #4f46e5 0%, #6d28d9 50%, #4338ca 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
}

.sidebar-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 25px;
  text-align: center;
}

.sidebar-menu {
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  list-style: none;
  margin-bottom: 14px;
}

.sidebar-menu a {
  display: block;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: #e0e7ff;
  font-size: 15px;
  transition: 0.25s ease;
}

.sidebar-menu a:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: translateX(4px);
}

.router-link-active {
  background: linear-gradient(90deg, #ffffff33, #ffffff11);
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 0 10px #ffffff33;
  transform: translateX(6px);
}
</style>
