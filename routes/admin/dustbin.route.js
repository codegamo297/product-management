const express = require("express");
const dustbinController = require("../../controllers/admin/dustbin.controller");

const router = express.Router();

router.get("/", dustbinController.index);
router.delete("/delete/:id", dustbinController.delete);
router.patch("/restore/:id", dustbinController.restore);
router.patch("/change-multi/", dustbinController.changeMulti);

module.exports = router;
