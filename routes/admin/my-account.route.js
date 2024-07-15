const express = require("express");
const multer = require("multer");

const myAccountController = require("../../controllers/admin/my-account.controller");
const validate = require("../../validates/admin/my-account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();
const upload = multer({
    limits: { fieldSize: 2 * 1024 * 1024 },
});

router.get("/", myAccountController.index);
router.get("/edit", myAccountController.edit);
router.patch(
    "/edit",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.handleEdit,
    myAccountController.handleEdit
);

module.exports = router;
