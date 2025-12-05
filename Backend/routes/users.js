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

router.put("/change-password", changePassword);

// CRUD USERS
router.get("/", getAll);
router.post("/", create);

router.get("/:id", getById);
router.put("/:id", update);
router.get("/ref/:refId", getByRef);
router.delete("/:id", remove);

module.exports = router;
