const express = require("express");
const multer = require("multer");

const accountController = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();
const upload = multer({
    limits: { fieldSize: 2 * 1024 * 1024 },
});

router.get("/", accountController.index);
router.get("/create", accountController.create);
router.post(
    "/create",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.handleCreate,
    accountController.handleCreate
);
router.get("/edit/:id", accountController.edit);
router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.handleEdit,
    accountController.handleEdit
);
router.get("/detail/:id", accountController.detail);
router.delete("/delete/:id", accountController.delete);
router.patch("/change-status/:status/:id", accountController.changeStatus);
router.patch("/change-multi", accountController.changeMulti);

module.exports = router;
