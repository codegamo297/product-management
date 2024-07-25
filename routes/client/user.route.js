const express = require("express");

const userController = require("../../controllers/client/user.controller");
const validate = require("../../validates/client/register.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

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
router.get("/password/forgot", userController.forgotPassword);
router.post("/password/forgot", userController.handleForgotPassword);
router.get("/password/otp", userController.otpPassword);
router.post("/password/otp", userController.handleOtpPassword);
router.get("/password/reset", userController.resetPassword);
router.post(
    "/password/reset",
    validate.handleResetPassword,
    userController.handleResetPassword
);
router.get("/info", authMiddleware.requireAuth, userController.info);

module.exports = router;
