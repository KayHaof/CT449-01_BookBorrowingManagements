<template>
  <footer class="footer-bg py-5">
    <div class="container">
      <!-- Main Footer Content -->
      <div class="row mb-5">
        <!-- Branding -->
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div class="mb-3">
            <i class="bi bi-book-half footer-icon me-2"></i>
            <span class="h5 fw-bold text-white">BookHub</span>
          </div>
          <p class="text-white-50 small">
            Hệ thống quản lý mượn sách hiện đại, giúp bạn quản lý thư viện dễ dàng và hiệu quả.
          </p>
          <!-- Social Media Icons -->
          <div class="mt-3">
            <a href="#" class="text-white-50 me-3 social-link">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="text-white-50 me-3 social-link">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="text-white-50 me-3 social-link">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="text-white-50 social-link">
              <i class="bi bi-linkedin"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <h6 class="text-white fw-bold mb-3">Truy Cập Nhanh</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="#" class="text-white-50 text-decoration-none footer-link">Trang chủ</a>
            </li>
            <li class="mb-2">
              <a href="/books" class="text-white-50 text-decoration-none footer-link">Danh sách sách</a>
            </li>
            <li class="mb-2">
              <a href="/borrow-history" class="text-white-50 text-decoration-none footer-link">Lịch sử mượn</a>
            </li>
            <li class="mb-2">
              <a href="/profile" class="text-white-50 text-decoration-none footer-link">Hồ sơ cá nhân</a>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <h6 class="text-white fw-bold mb-3">Hỗ Trợ</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="#" class="text-white-50 text-decoration-none footer-link"
                >Trung tâm trợ giúp</a
              >
            </li>
            <li class="mb-2">
              <a href="#" class="text-white-50 text-decoration-none footer-link"
                >Liên hệ chúng tôi</a
              >
            </li>
            <li class="mb-2">
              <a href="#" class="text-white-50 text-decoration-none footer-link"
                >Câu hỏi thường gặp</a
              >
            </li>
            <li class="mb-2">
              <a href="#" class="text-white-50 text-decoration-none footer-link">Báo cáo lỗi</a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <h6 class="text-white fw-bold mb-3">Liên Hệ</h6>
          <div class="mb-3">
            <div class="d-flex align-items-start text-white-50 small mb-2">
              <i class="bi bi-telephone-fill me-2 mt-1"></i>
              <span>(+84) 123 456 789</span>
            </div>
            <div class="d-flex align-items-start text-white-50 small mb-2">
              <i class="bi bi-envelope-fill me-2 mt-1"></i>
              <span>OnlineLibrarySystem.vn</span>
            </div>
            <div class="d-flex align-items-start text-white-50 small">
              <i class="bi bi-geo-alt-fill me-2 mt-1"></i>
              <span>Đ. 3/2, phường Xuân Khánh, TP. Cần Thơ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <hr class="border-secondary-50 my-4" />

      <!-- Bottom Footer -->
      <div class="row align-items-center">
        <div class="col-md-6 mb-3 mb-md-0">
          <p class="text-white-50 small mb-0">© 2025 BookHub. Mọi quyền được bảo vệ.</p>
        </div>
        <div class="col-md-6">
          <div class="d-flex justify-content-md-end gap-3">
            <a href="#" class="text-white-50 text-decoration-none footer-link small">
              Chính sách bảo mật
            </a>
            <a href="#" class="text-white-50 text-decoration-none footer-link small">
              Điều khoản sử dụng
            </a>
            <a href="#" class="text-white-50 text-decoration-none footer-link small">
              Cài đặt cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script needed - pure presentational component
</script>

<style scoped>
.footer-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.footer-icon {
  font-size: 1.5rem;
  color: #fff;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.7);
}

.social-link {
  font-size: 1.25rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.social-link:hover {
  color: #fff !important;
  transform: translateY(-3px);
}

.footer-link {
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #fff !important;
  padding-left: 5px;
}

.border-secondary-50 {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

h6 {
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

li {
  transition: all 0.3s ease;
}

ul li:hover {
  padding-left: 5px;
}
</style>
