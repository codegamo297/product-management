const md5 = require("md5");

const User = require("../../models/user.model");

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng ký tài khoản",
    });
};

// [POST] user/register
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
