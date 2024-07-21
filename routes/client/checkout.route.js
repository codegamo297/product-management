const express = require("express");
const checkoutController = require("../../controllers/client/checkout.controller");

const router = express.Router();

router.get("/", checkoutController.index);
router.post("/order", checkoutController.handleOrder);
router.get("/success/:orderId", checkoutController.success);

module.exports = router;
