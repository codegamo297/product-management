const express = require("express");
const roleController = require("../../controllers/admin/role.controller");

const router = express.Router();

router.get("/", roleController.index);
router.get("/create", roleController.createGroupForm);
router.post("/create", roleController.createGroup);
router.get("/edit/:id", roleController.editGroupForm);
router.patch("/edit/:id", roleController.editGroup);
router.get("/detail/:id", roleController.detailGroupForm);
router.delete("/delete/:id", roleController.deleteGroup);

module.exports = router;
