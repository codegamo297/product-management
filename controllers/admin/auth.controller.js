const md5 = require("md5");

const Accounts = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập",
    });
};

// [POST] /admin/auth/login
module.exports.handleLogin = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await Accounts.findOne({
        email: email,
        deleted: false,
    });

    if (!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if (user.password !== password) {
        req.flash("error", "Mật khẩu không đúng");
        res.redirect("back");
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản chưa được kích hoạt");
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
