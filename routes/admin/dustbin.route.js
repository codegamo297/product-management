const express = require("express");
const dustbinController = require("../../controllers/admin/dustbin.controller");

const router = express.Router();

router.get("/", dustbinController.index);
router.delete("/delete/:id", dustbinController.delete);

module.exports = router;
