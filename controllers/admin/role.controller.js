const Roles = require("../../models/role.model");
const Accounts = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const records = await Roles.find({
        deleted: false,
    });

    for (const record of records) {
        // Lấy in4 người tạo
        const creator = await Accounts.findOne({
            _id: record.createdBy.account_id,
        });

        if (creator) {
            record.accountCreatedFullName = creator.fullName;
        }

        // Lấy in4 người cập nhật
        const updatedBy = record.updatedBy.slice(-1)[0];

        if (updatedBy) {
            const userUpdated = await Accounts.findOne({
                _id: updatedBy.account_id,
            });

            updatedBy.accountFullName = userUpdated.fullName;
        }
    }

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records,
    });
};

// [GET] /admin/roles/create
module.exports.createGroupForm = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    });
};

// [POST] /admin/roles/create
module.exports.createGroup = async (req, res) => {
    req.body.createdBy = {
        account_id: res.locals.user.id,
    };

    const record = new Roles(req.body);
    await record.save();

    req.flash("success", `Đã thêm thành công 1 nhóm quyền`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.editGroupForm = async (req, res) => {
    try {
        const record = await Roles.findOne({
            deleted: false,
            _id: req.params.id,
        });

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record,
        });
    } catch (error) {
        req.flash("error", "Không tồn tại nhóm quyền này");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editGroup = async (req, res) => {
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    };
    try {
        await Roles.updateOne(
            { _id: req.params.id },
            { ...req.body, $push: { updatedBy: updatedBy } }
        );

        req.flash("success", `Đã cập nhật thành công nhóm quyền`);
    } catch (error) {
        req.flash("error", `Cập nhật không thành công nhóm quyền`);
    }

    res.redirect(`${systemConfig.prefixAdmin}/roles/detail/${req.params.id}`);
};

// [GET] /admin/roles/detail/:id
module.exports.detailGroupForm = async (req, res) => {
    try {
        const record = await Roles.findOne({
            deleted: false,
            _id: req.params.id,
        });

        res.render("admin/pages/roles/detail", {
            pageTitle: "Chi tiết nhóm quyền",
            record: record,
        });
    } catch (error) {
        req.flash("error", "Không tồn tại nhóm quyền này");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

// [DELETE] /admin/roles/delete/:id
module.exports.deleteGroup = async (req, res) => {
    await Roles.updateOne(
        { _id: req.params.id },
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            },
        }
    );
    req.flash("success", "Đã xóa thành công nhóm quyền");
    res.redirect("back");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const records = await Roles.find({ deleted: false });

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records,
    });
};

// [PATCH] /admin/roles/permissions
module.exports.handlePermissions = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    };

    for (let item of permissions) {
        await Roles.updateOne(
            { _id: item.id },
            { permissions: item.permissions, $push: { updatedBy: updatedBy } }
        );
    }

    req.flash("success", "Đã phân quyền thành công");
    res.redirect("back");
};
