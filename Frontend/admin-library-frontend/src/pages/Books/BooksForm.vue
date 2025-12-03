<template>
  <AdminModal :title="editData ? 'Sửa sách' : 'Thêm sách'" @close="$emit('close')">
    <form @submit.prevent="save">
      <AdminFormGroup label="Mã sách">
        <input class="form-control" v-model="form.maSach" required />
      </AdminFormGroup>

      <AdminFormGroup label="Tên sách">
        <input class="form-control" v-model="form.tenSach" required />
      </AdminFormGroup>

      <AdminFormGroup label="Đơn giá">
        <input type="number" class="form-control" v-model="form.donGia" />
      </AdminFormGroup>

      <AdminFormGroup label="Số quyển">
        <input type="number" class="form-control" v-model="form.soQuyen" />
      </AdminFormGroup>

      <AdminFormGroup label="Năm xuất bản">
        <input type="number" class="form-control" v-model="form.namXuatBan" />
      </AdminFormGroup>

      <!-- ẢNH BÌA: đổi từ URL sang chọn file -->
      <AdminFormGroup label="Ảnh bìa">
        <input type="file" class="form-control" accept="image/*" @change="onImageChange" />

        <img
          v-if="previewImage"
          :src="getImageUrl(previewImage)"
          class="img-thumbnail mt-2"
          style="max-height: 150px"
        />
      </AdminFormGroup>

      <!-- ====================== NXB ====================== -->
      <AdminFormGroup label="Nhà xuất bản">
        <div class="select-row">
          <select class="form-select" v-model="form.maNhaXuatBan">
            <option disabled value="">-- Chọn NXB --</option>
            <option v-for="p in publishers" :key="p._id" :value="p._id">
              {{ p.tenNXB }}
            </option>
          </select>

          <button type="button" class="btn-add" @click="showPublisherForm = true">+</button>
        </div>
      </AdminFormGroup>

      <!-- ====================== THỂ LOẠI ====================== -->
      <AdminFormGroup label="Thể loại">
        <div class="select-row">
          <select class="form-select" v-model="form.maPhanLoai">
            <option disabled value="">-- Chọn thể loại --</option>
            <option v-for="c in categories" :key="c._id" :value="c._id">
              {{ c.tenLoai }}
            </option>
          </select>

          <button type="button" class="btn-add" @click="showCategoryForm = true">+</button>
        </div>
      </AdminFormGroup>

      <!-- ====================== TÁC GIẢ ====================== -->
      <AdminFormGroup label="Tác giả" data-full>
        <div class="select-row">
          <select class="form-select author-select" v-model="form.maTacGia" multiple>
            <option v-for="a in authors" :key="a._id" :value="a._id">
              {{ a.hoTen }}
            </option>
          </select>

          <button type="button" class="btn-add" @click="showAuthorForm = true">+</button>
        </div>
      </AdminFormGroup>

      <button class="btn btn-primary w-100 mt-3">Lưu</button>
    </form>

    <!-- ====================== MODALS ====================== -->
    <AdminModal v-if="showPublisherForm" title="Thêm NXB" @close="closePublisher">
      <PublishersForm @saved="afterAddPublisher" @close="closePublisher" />
    </AdminModal>

    <AdminModal v-if="showCategoryForm" title="Thêm thể loại" @close="closeCategory">
      <CategoriesForm @saved="afterAddCategory" @close="closeCategory" />
    </AdminModal>

    <AdminModal v-if="showAuthorForm" title="Thêm tác giả" @close="closeAuthor">
      <AuthorsForm @saved="afterAddAuthor" @close="closeAuthor" />
    </AdminModal>
  </AdminModal>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue'

import AdminModal from '../../components/AdminModal.vue'
import AdminFormGroup from '../../components/AdminFormGroup.vue'
import PublishersForm from '../Publishers/PublishersForm.vue'
import CategoriesForm from '../Categories/CategoriesForm.vue'
import AuthorsForm from '../Authors/AuthorsForm.vue'

import useBooks from '@/composables/useBooks'
import usePublishers from '@/composables/usePublishers'
import useCategories from '@/composables/useCategories'
import useAuthors from '@/composables/useAuthors'

const props = defineProps({ editData: Object })
const emit = defineEmits(['close', 'saved'])

const { createBook, updateBook } = useBooks()
const { getPublishers } = usePublishers()
const { getCategories } = useCategories()
const { getAuthors } = useAuthors()

const publishers = ref([])
const categories = ref([])
const authors = ref([])

// ===== MODAL FLAGS =====
const showPublisherForm = ref(false)
const showCategoryForm = ref(false)
const showAuthorForm = ref(false)

// ===== IMAGE PREVIEW =====
const previewImage = ref(null)
const selectedImage = ref(null)

const onImageChange = (e) => {
  const file = e.target.files[0]
  selectedImage.value = file
  if (file) previewImage.value = URL.createObjectURL(file)
}

const BE_URL = 'http://localhost:8080'

// chuẩn URL hình ảnh
const getImageUrl = (path) => {
  if (!path) return '/no-image.jpg'
  return `${BE_URL}${path}`
}

// ===== FORM DATA =====
const defaultForm = {
  maSach: '',
  tenSach: '',
  donGia: '',
  soQuyen: '',
  namXuatBan: '',
  biaSach: '',
  maNhaXuatBan: '',
  maPhanLoai: '',
  maTacGia: [],
}

const form = reactive({ ...defaultForm })

onMounted(async () => {
  publishers.value = await getPublishers()
  categories.value = await getCategories()
  authors.value = await getAuthors()
})

// Khi sửa → load data
watch(
  () => props.editData,
  (v) => {
    Object.assign(form, defaultForm)
    if (v) {
      form.maSach = v.maSach
      form.tenSach = v.tenSach
      form.donGia = v.donGia
      form.soQuyen = v.soQuyen
      form.namXuatBan = v.namXuatBan
      form.biaSach = v.biaSach

      form.maNhaXuatBan = v.maNhaXuatBan?._id
      form.maPhanLoai = v.maPhanLoai?._id
      form.maTacGia = v.maTacGia?.map((a) => a._id) || []

      previewImage.value = v.biaSach
    }
  },
  { immediate: true },
)

import { toast } from '@/utils/toast'

// ===== SAU KHI THÊM MỚI NHÀ XUẤT BẢN =====
const afterAddPublisher = async () => {
  publishers.value = await getPublishers()
  showPublisherForm.value = false
}

// ===== SAU KHI THÊM MỚI THỂ LOẠI =====
const afterAddCategory = async () => {
  categories.value = await getCategories()
  showCategoryForm.value = false
}

// ===== SAU KHI THÊM MỚI TÁC GIẢ =====
const afterAddAuthor = async () => {
  authors.value = await getAuthors()
  showAuthorForm.value = false
}

const closePublisher = () => (showPublisherForm.value = false)
const closeCategory = () => (showCategoryForm.value = false)
const closeAuthor = () => (showAuthorForm.value = false)

// ===== LƯU SÁCH =====
const save = async () => {
  try {
    const fd = new FormData()

    // add all normal fields
    fd.append('maSach', form.maSach)
    fd.append('tenSach', form.tenSach)
    fd.append('donGia', form.donGia)
    fd.append('soQuyen', form.soQuyen)
    fd.append('namXuatBan', form.namXuatBan)
    fd.append('maNhaXuatBan', form.maNhaXuatBan)
    fd.append('maPhanLoai', form.maPhanLoai)

    // array maTacGia[]
    form.maTacGia.forEach((id) => {
      fd.append('maTacGia[]', id)
    })

    // ảnh nếu có
    if (selectedImage.value) {
      fd.append('biaSach', selectedImage.value)
    } else if (form.biaSach) {
      // nếu đang chỉnh sửa mà không đổi ảnh
      fd.append('biaSach', form.biaSach)
    }

    if (props.editData) {
      await updateBook(props.editData._id, fd)
      toast.success('Cập nhật sách thành công!')
    } else {
      await createBook(fd)
      toast.success('Thêm sách thành công!')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    toast.error('Lưu sách thất bại!')
  }
}
</script>

<style scoped>
.select-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-add {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #7b5cff;
  color: #7b5cff;
  font-size: 20px;
  padding-bottom: 3px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-add:hover {
  background: #f2eaff;
}
</style>
