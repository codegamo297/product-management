const md5 = require("md5");

const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");

// [GET] /user/register
module.exports.register = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.redirect("/");
    }

    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng ký tài khoản",
    });
};

// [POST] /user/register
module.exports.handleRegister = async (req, res) => {
    const { fullName, email } = req.body;
    const password = md5(req.body.password);

    const exitsEmail = await User.findOne({
        email: email,
    });

    if (exitsEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }

    const user = new User({
        fullName: fullName,
        email: email,
        password: password,
    });

    await user.save();
    res.cookie("tokenUser", user.tokenUser, { maxAge: 24 * 3600000 * 7 });

    res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.redirect("/");
    }

    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng nhập tài khoản",
    });
};

// [POST] /user/login
module.exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (user.password !== md5(password)) {
        req.flash("error", "Mật khẩu không chính xác");
        res.redirect("back");
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản của bạn đã bị khóa");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser, { maxAge: 24 * 3600000 * 7 });
    res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Quên mật khẩu",
    });
};

// [POST] /user/password/forgot
module.exports.handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email, deleted: false });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    const otp = generateHelper.generateRandomNumber(6);
    const objForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 1000 * 60 * 2),
    };
    const forgotPassword = new ForgotPassword(objForgotPassword);
    forgotPassword.save();

    res.send("ok");
};
