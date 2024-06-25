const express = require("express");
const dashboardController = require("../../controllers/admin/dashboard.controller");

const router = express.Router();

router.get("/", dashboardController.dashboard);

module.exports = router;
