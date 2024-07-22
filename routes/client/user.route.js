const express = require("express");
const userController = require("../../controllers/client/user.controller");

const validate = require("../../validates/client/register.validate");

const router = express.Router();

router.get("/register", userController.register);
router.post(
    "/register",
    validate.handleRegister,
    userController.handleRegister
);
router.get("/login", userController.login);
router.post("/login", validate.handleLogin, userController.handleLogin);
router.get("/logout", userController.logout);

module.exports = router;
