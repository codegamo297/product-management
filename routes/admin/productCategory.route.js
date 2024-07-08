const express = require("express");
const multer = require("multer");

const productCategoryController = require("../../controllers/admin/productCategory.controller");
const validate = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();
const upload = multer({
    limits: { fieldSize: 2 * 1024 * 1024 },
});

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
router.get("/edit/:id", productCategoryController.edit);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.handleCreate,
    productCategoryController.handleEditProductCategory
);
router.get("/detail/:id", productCategoryController.detail);

module.exports = router;
