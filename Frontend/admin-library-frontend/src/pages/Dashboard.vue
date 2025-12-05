<template>
  <div class="dashboard container-fluid py-4">
    <!-- TITLE -->
    <div class="mb-4">
      <h2 class="dashboard-title"><i class="fa-solid fa-chart-line me-2"></i> Dashboard</h2>
    </div>

    <!-- STATS ROW -->
    <div class="row g-4 mb-4">
      <div class="col-12 col-sm-6 col-xl-3" v-for="stat in stats" :key="stat.title">
        <div class="stat-card shadow-sm">
          <div class="stat-icon" :style="{ background: stat.color }">
            <i :class="stat.icon"></i>
          </div>

          <div class="stat-info">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.title }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- RECENT BORROWS -->
    <div class="card section-card shadow-sm rounded-4 p-4 mb-4">
      <h5 class="section-title mb-3">Lịch sử mượn gần đây</h5>

      <div class="table-responsive">
        <table class="table table-hover align-middle dashboard-table">
          <thead>
            <tr>
              <th>Độc giả</th>
              <th>Sách</th>
              <th>Ngày mượn</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in recentBorrows" :key="item._id">
              <td>{{ fullName(item.maDocGia) }}</td>
              <td>{{ item.maSach?.tenSach }}</td>
              <td>{{ format(item.ngayMuon) }}</td>
              <td>
                <span :class="statusClass(item.trangThai)">
                  {{ statusText(item.trangThai) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="chart-card section-card shadow-sm rounded-4 p-4">
          <h5 class="section-title mb-3">Thống kê mượn theo tháng</h5>

          <!-- FIX: WRAPPER CÓ HEIGHT CỐ ĐỊNH -->
          <div class="chart-wrapper">
            <canvas id="borrowLineChart"></canvas>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="chart-card section-card shadow-sm rounded-4 p-4">
          <h5 class="section-title mb-3">Tỷ lệ trạng thái mượn</h5>

          <div class="chart-wrapper">
            <canvas id="statusPieChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

import useBooks from '@/composables/useBooks'
import useReaders from '@/composables/useReaders'
import useBorrows from '@/composables/useBorrows'
import useFines from '@/composables/useFines'

const { getBooks } = useBooks()
const { getReaders } = useReaders()
const { getBorrows } = useBorrows()
const { getFines } = useFines()

const stats = ref([])
const recentBorrows = ref([])

let lineChart = null
let pieChart = null

const format = (d) => new Date(d).toLocaleDateString('vi-VN')
const fullName = (r) => (r ? `${r.hoLot} ${r.ten}` : '')

const statusText = (s) =>
  ({
    dang_ky_muon: 'Đăng ký mượn',
    dang_muon: 'Đang mượn',
    da_tra: 'Đã trả',
    tre_han: 'Trễ hạn',
  })[s] || 'Không rõ'

const statusClass = (s) =>
  ({
    dang_ky_muon: 'badge-status badge-info',
    dang_muon: 'badge-status badge-success',
    da_tra: 'badge-status badge-secondary',
    tre_han: 'badge-status badge-danger',
  })[s]

const buildCharts = (borrows) => {
  const months = Array(12).fill(0)
  borrows.forEach((b) => {
    if (!b.ngayMuon) return
    const m = new Date(b.ngayMuon).getMonth()
    months[m]++
  })

  const ctx1 = document.getElementById('borrowLineChart')
  if (lineChart) lineChart.destroy()

  lineChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [
        {
          label: 'Lượt mượn',
          data: months,
          borderWidth: 3,
          borderColor: '#2563eb',
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })

  const statusCount = { dang_ky_muon: 0, dang_muon: 0, da_tra: 0, tre_han: 0 }
  borrows.forEach((b) => {
    if (statusCount[b.trangThai] != null) statusCount[b.trangThai]++
  })

  const ctx2 = document.getElementById('statusPieChart')
  if (pieChart) pieChart.destroy()

  pieChart = new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: ['Đăng ký mượn', 'Đang mượn', 'Đã trả', 'Trễ hạn'],
      datasets: [
        {
          data: [
            statusCount.dang_ky_muon,
            statusCount.dang_muon,
            statusCount.da_tra,
            statusCount.tre_han,
          ],
          backgroundColor: ['#60a5fa', '#34d399', '#cbd5e1', '#ef4444'],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}

onMounted(async () => {
  const [books, readers, borrows, fines] = await Promise.all([
    getBooks(),
    getReaders(),
    getBorrows(),
    getFines(),
  ])

  stats.value = [
    { title: 'Sách', value: books.length, icon: 'fa fa-book', color: '#EEF2FF' },
    { title: 'Độc giả', value: readers.length, icon: 'fa fa-user', color: '#FFE4E6' },
    {
      title: 'Đang mượn',
      value: borrows.filter((b) => b.trangThai === 'dang_muon').length,
      icon: 'fa fa-book-open',
      color: '#E0F2FE',
    },
    { title: 'Phiếu phạt', value: fines.length, icon: 'fa fa-warning', color: '#FEF3C7' },
  ]

  recentBorrows.value = borrows.slice(-5).reverse()

  buildCharts(borrows)
})
</script>

<style scoped>
.dashboard {
  background: #f8fafc;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: 0.2s;
  border: 1px solid #e5e7eb;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #111;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.section-card {
  border: 1px solid #e5e7eb;
  background: white;
}

.dashboard-table thead {
  background: #f1f5f9;
}

.dashboard-table tbody tr:hover {
  background: #f9fafb;
}

.dashboard-table th {
  font-weight: 600;
  color: #334155;
}

.badge-status {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.badge-info {
  background: #dbeafe;
  color: #1e40af;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-secondary {
  background: #e2e8f0;
  color: #475569;
}

.badge-danger {
  background: #fee2e2;
  color: #b91c1c;
}

.chart-card {
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: white;
}

.chart-wrapper {
  height: 260px;
  position: relative;
}

.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}
</style>
