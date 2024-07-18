const express = require("express");
const searchController = require("../../controllers/client/search.controller");

const router = express.Router();

router.get("/", searchController.index);

module.exports = router;
