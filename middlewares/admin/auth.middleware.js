const Accounts = require("../../models/account.model");
const Roles = require("../../models/role.model");

const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Accounts.findOne({
            token: token,
            deleted: false,
        }).select("-password");

        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }

        if (user.status === "inactive") {
            req.flash("error", "Tài khoản chưa được kích hoạt");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        const role = await Roles.findOne({
            _id: user.role_id,
        }).select("title permissions");

        res.locals.user = user;
        res.locals.role = role;

        next();
    }
};
