const express = require("express");
const authController = require("../../controllers/admin/auth.controller");
const validate = require("../../validates/admin/login.validate");

const router = express.Router();

router.get("/login", authController.login);
router.post("/login", validate.handleLogin, authController.handleLogin);
router.get("/logout", authController.logout);

module.exports = router;
