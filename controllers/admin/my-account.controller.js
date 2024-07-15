const md5 = require("md5");

const Accounts = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Thông tin cá nhân",
    });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit.pug", {
        pageTitle: "Chỉnh sửa thông tin",
    });
};

// [PATCH] /admin/my-account/edit
module.exports.handleEdit = async (req, res) => {
    try {
        const id = res.locals.user.id;
        const emailExits = await Accounts.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false,
        });

        if (emailExits) {
            req.flash("error", "Email đã tồn tại");
        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }

            const updatedBy = {
                account_id: id,
                updatedAt: new Date(),
            };

            await Accounts.updateOne(
                { _id: id },
                { ...req.body, $push: { updatedBy: updatedBy } }
            );

            req.flash("success", `Đã cập nhật thành công tài khoản`);
            res.redirect(`${systemConfig.prefixAdmin}/my-account`);

            return;
        }
    } catch (error) {
        req.flash("error", `Cập nhật không thành công tài khoản`);
    }

    res.redirect("back");
};
