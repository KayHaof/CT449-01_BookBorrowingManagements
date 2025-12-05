const express = require("express");
const router = express.Router();
const {
    getAll,
    getById,
    create,
    update,
    remove,
    changePassword,
    getByRef,
} = require("../controllers/userController");

// 🔥 ĐẶT ROUTE NÀY LÊN TRÊN
router.put("/change-password", changePassword);

// CRUD USERS
router.get("/", getAll);
router.post("/", create);

// ❗ Các route động phải để SAU
router.get("/:id", getById);
router.put("/:id", update);
router.get("/ref/:refId", getByRef);
router.delete("/:id", remove);

module.exports = router;
