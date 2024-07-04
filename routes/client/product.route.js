const express = require("express");
const productController = require("../../controllers/client/product.controller");

const router = express.Router();

router.get("/", productController.index);
router.get("/detail/:slug", productController.detail);

module.exports = router;
