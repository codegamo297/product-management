const md5 = require("md5");

const Accounts = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        const user = await Accounts.findOne({
            token: token,
            deleted: false,
        });

        if (!user) {
            res.send("Bạn cố tình sửa token, vì vậy hành động của bạn bị cấm");
            return;
        }

        if (user.status === "inactive") {
            res.send(
                "Tài khoản của bạn đã bị khóa, vui lòng liên hệ với quản trị viên"
            );
            return;
        }

        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Trang đăng nhập",
        });
    }
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

    res.cookie("token", user.token, {
        maxAge: 24 * 3600000 * 7,
    });
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
