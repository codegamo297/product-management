const express = require("express");
const homeController = require("../../controllers/client/home.controller");

const router = express.Router();

router.get("/", homeController.index);

module.exports = router;
