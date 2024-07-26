const md5 = require("md5");

const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

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

    // Kiểm tra user có nằm trong giỏ hàng nào hay chưa, nếu chưa thì thêm user vào giỏ hàng
    // Nếu rồi thì chuyển cookies của cart đó về của user
    const cart = await Cart.findOne({
        user_id: user.id,
    });

    if (cart) {
        res.cookie("cartId", cart.id);
    } else {
        await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });
    }

    res.cookie("tokenUser", user.tokenUser, { maxAge: 24 * 3600000 * 7 });
    res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("cartId");
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.redirect("/");
    }

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
        expireAt: new Date(Date.now() + 1000 * 60 * 3),
    };
    const forgotPassword = new ForgotPassword(objForgotPassword);
    await forgotPassword.save();

    // Nếu tồn tại email thì gửi OTP qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>.
        Thời hạn sử dụng là 3 phút.
    `;
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.redirect("/");
    }

    const email = req.query.email;

    res.render("client/pages/user/otp-password.pug", {
        pageTitle: "Nhập mã OTP",
        email: email,
    });
};

// [POST] /user/password/otp
module.exports.handleOtpPassword = async (req, res) => {
    const { email, otp } = req.body;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });

    if (!result) {
        req.flash("error", "Mã OTP không đúng!");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email,
    });

    res.cookie("tokenUserForgotPassword", user.tokenUser);
    res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.redirect("/");
    }

    res.render("client/pages/user/reset-password.pug", {
        pageTitle: "Đổi mật khẩu",
    });
};

// [POST] /user/password/reset
module.exports.handleResetPassword = async (req, res) => {
    const { password } = req.body;
    const tokenUser = req.cookies.tokenUserForgotPassword;

    await User.updateOne({ tokenUser: tokenUser }, { password: md5(password) });

    res.cookie("tokenUser", tokenUser);
    res.clearCookie("tokenUserForgotPassword");
    req.flash("success", "Đổi mật khẩu thành công");
    res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info.pug", {
        pageTitle: "Thông tin tài khoản",
    });
};
