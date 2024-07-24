const regex = require("../../helpers/regex");

module.exports.handleRegister = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", `Vui lòng nhập tên người dùng`);
        res.redirect("back");
        return;
    }

    if (req.body.fullName.length < 4) {
        req.flash(
            "error",
            `Vui lòng nhập tên người có độ dài tối thiểu 4 ký tự`
        );
        res.redirect("back");
        return;
    }

    if (!req.body.email) {
        req.flash("error", `Vui lòng nhập email`);
        res.redirect("back");
        return;
    }

    if (req.body.email) {
        if (!regex.email(req.body.email)) {
            req.flash("error", `Email không hợp lệ`);
            res.redirect("back");
            return;
        }
    }

    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập mật khẩu`);
        res.redirect("back");
        return;
    }

    if (req.body.password.length < 4) {
        req.flash("error", `Vui lòng nhập mật khẩu có độ dài lớn hơn 4`);
        res.redirect("back");
        return;
    }

    next();
};

module.exports.handleLogin = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", `Vui lòng nhập email`);
        res.redirect("back");
        return;
    }

    if (req.body.email) {
        if (!regex.email(req.body.email)) {
            req.flash("error", `Email không hợp lệ`);
            res.redirect("back");
            return;
        }
    }

    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập mật khẩu`);
        res.redirect("back");
        return;
    }

    if (req.body.password.length < 4) {
        req.flash("error", `Vui lòng nhập mật khẩu có độ dài lớn hơn 4`);
        res.redirect("back");
        return;
    }

    next();
};

module.exports.handleResetPassword = async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!password) {
        req.flash("error", `Vui lòng nhập mật khẩu mới`);
        res.redirect("back");
        return;
    }

    if (password.length < 4) {
        req.flash("error", `Vui lòng nhập mật khẩu có độ dài lớn hơn 4`);
        res.redirect("back");
        return;
    }

    if (!confirmPassword) {
        req.flash("error", `Vui lòng xác nhận mật khẩu`);
        res.redirect("back");
        return;
    }

    if (confirmPassword !== password) {
        req.flash("error", `Xác nhận mật khẩu không chính xác`);
        res.redirect("back");
        return;
    }

    next();
};
