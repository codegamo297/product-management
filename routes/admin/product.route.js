const express = require("express");
const multer = require("multer");
const productController = require("../../controllers/admin/product.controller");
const storageMulter = require("../../helpers/storageMulter");

const router = express.Router();
const upload = multer({ storage: storageMulter() });

router.get("/", productController.index);
router.patch("/change-status/:status/:id", productController.changeStatus);
router.patch("/change-multi", productController.changeMulti);
router.delete("/delete/:id", productController.delete);
router.get("/create", productController.create);
router.post("/store", upload.single("thumbnail"), productController.post);

module.exports = router;
