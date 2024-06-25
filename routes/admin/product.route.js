const express = require("express");
const productController = require("../../controllers/admin/product.controller");

const router = express.Router();

router.get("/", productController.index);

module.exports = router;
