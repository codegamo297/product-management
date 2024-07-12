const regex = require("../../helpers/regex");

module.exports.handleCreate = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", `Vui lòng nhập tên`);
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
        req.flash("error", `Vui lòng nhập password`);
        res.redirect("back");
        return;
    }

    if (req.body.password.length < 4) {
        req.flash("error", `Vui lòng nhập password có độ dài lớn hơn 4`);
        res.redirect("back");
        return;
    }

    if (req.body.phone) {
        if (!regex.phone(req.body.phone)) {
            req.flash("error", `Số điện thoại không hợp lệ`);
            res.redirect("back");
            return;
        }
    }

    next();
};

module.exports.handleEdit = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", `Vui lòng nhập tên`);
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

    if (req.body.password && req.body.password.length < 4) {
        req.flash("error", `Vui lòng nhập password có độ dài lớn hơn 4`);
        res.redirect("back");
        return;
    }

    if (req.body.phone) {
        if (!regex.phone(req.body.phone)) {
            req.flash("error", `Số điện thoại không hợp lệ`);
            res.redirect("back");
            return;
        }
    }

    next();
};
