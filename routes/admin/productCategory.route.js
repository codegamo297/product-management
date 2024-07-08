const express = require("express");
const multer = require("multer");

const productCategoryController = require("../../controllers/admin/productCategory.controller");
const validate = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();
const upload = multer();

router.get("/", productCategoryController.index);
router.patch(
    "/change-status/:status/:id",
    productCategoryController.changeStatus
);
router.patch("/change-multi", productCategoryController.changeMulti);
router.get("/create", productCategoryController.create);
router.post(
    "/store",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.handleCreate,
    productCategoryController.handleCreate
);

module.exports = router;
