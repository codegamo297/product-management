const express = require("express");
const productController = require("../../controllers/admin/product.controller");

const router = express.Router();

router.get("/", productController.index);
router.patch("/change-status/:status/:id", productController.changeStatus);
router.patch("/change-multi", productController.changeMulti);
router.delete("/delete/:id", productController.delete);
router.get("/create", productController.create);
router.post("/store", productController.post);

module.exports = router;
