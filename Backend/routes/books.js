const express = require("express");
const router = express.Router();
const {
    getAll,
    getById,
    create,
    update,
    remove,
} = require("../controllers/bookController");

const upload = require("../middlewares/upload");

// === BOOKS (Sach) ===
router.get("/", getAll);
router.get("/:id", getById);

// Upload ảnh khi tạo sách: field "biaSach"
router.post("/", upload.single("biaSach"), create);

// Cập nhật sách (có thể có hoặc không có ảnh)
router.put("/:id", upload.single("biaSach"), update);

router.delete("/:id", remove);

module.exports = router;
