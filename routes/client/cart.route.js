const express = require("express");
const cartController = require("../../controllers/client/cart.controller");

const router = express.Router();

router.get("/", cartController.index);
router.post("/add/:productId", cartController.handleAdd);
router.get("/delete/:productId", cartController.delete);
router.get("/update/:productId/:quantity", cartController.update);

module.exports = router;
