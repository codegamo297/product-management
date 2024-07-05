const express = require("express");
const multer = require("multer");

const productController = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();
const upload = multer();

router.get("/", productController.index);
router.patch("/change-status/:status/:id", productController.changeStatus);
router.patch("/change-multi", productController.changeMulti);
router.delete("/delete/:id", productController.delete);
router.get("/create", productController.create);
router.post(
    "/store",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.handleCreateProduct,
    productController.handleCreateProduct
);
router.get("/edit/:id", productController.edit);
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.handleCreateProduct,
    productController.handleEditProduct
);
router.get("/detail/:id", productController.detail);

module.exports = router;
