const express = require("express");
const multer = require("multer");

const settingController = require("../../controllers/admin/setting.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();
const upload = multer({
    limits: { fieldSize: 2 * 1024 * 1024 },
});

router.get("/general", settingController.general);
router.patch(
    "/general",
    upload.single("logo"),
    uploadCloud.upload,
    settingController.handleGeneral
);

module.exports = router;
