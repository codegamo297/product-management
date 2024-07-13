const Accounts = require("../../models/account.model");

const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Accounts.findOne({
            token: token,
            deleted: false,
        });

        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }

        if (user.status === "inactive") {
            req.flash("error", "Tài khoản chưa được kích hoạt");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }

        next();
    }
};
