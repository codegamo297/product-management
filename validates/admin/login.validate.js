const regex = require("../../helpers/regex");

module.exports.handleLogin = (req, res, next) => {
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
