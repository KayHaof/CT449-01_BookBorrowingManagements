<template>
  <div class="col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm book-card">
      <img
        v-if="book.cover"
        :src="book.cover"
        class="card-img-top"
        :alt="book.title"
        style="height: 250px; object-fit: cover"
      />
      <div
        v-else
        class="bg-light d-flex align-items-center justify-content-center"
        style="height: 250px"
      >
        <i class="bi bi-book text-muted" style="font-size: 3rem"></i>
      </div>

      <div class="card-body">
        <h5 class="card-title">{{ book.title }}</h5>
        <p class="card-text text-muted">
          <small>{{ book.author }}</small>
        </p>

        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-primary">{{ book.category }}</span>
          <span v-if="book.available > 0" class="badge bg-success"
            >Sẵn có: {{ book.available }}</span
          >
          <span v-else class="badge bg-danger">Hết sách</span>
        </div>

        <p class="card-text">
          <small>{{ book.description }}</small>
        </p>
      </div>

      <div class="card-footer bg-white border-top">
        <router-link :to="`/book/${book.id}`" class="btn btn-primary btn-sm w-100">
          Xem chi tiết
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
})
</script>
