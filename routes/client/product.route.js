const express = require("express");
const productController = require("../../controllers/client/product.controller");

const router = express.Router();

router.get("/", productController.index);

module.exports = router;
