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

module.exports = router;
