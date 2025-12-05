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

router.get("/", getAll);
router.get("/:id", getById);

router.post("/", upload.single("biaSach"), create);

router.put("/:id", upload.single("biaSach"), update);

router.delete("/:id", remove);

module.exports = router;
