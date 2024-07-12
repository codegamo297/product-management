const md5 = require("md5");

const Accounts = require("../../models/account.model");
const Roles = require("../../models/role.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    // Bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    const find = {
        deleted: false,
    };

    if (req.query.status) find.status = req.query.status;

    // Tìm kiếm
    const objSearch = searchHelper(req.query);

    if (objSearch.regexKeyword) find.fullName = objSearch.regexKeyword;

    const records = await Accounts.find(find).select(
        "fullName email phone avatar status role_id"
    );

    for (let record of records) {
        const role = await Roles.findOne({
            _id: record.role_id,
            deleted: false,
        });

        record.role = role;
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Trang danh sách tài khoản",
        records: records,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Roles.find({ deleted: false });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo tài khoản",
        roles: roles,
    });
};

// [POST] /admin/accounts/create
module.exports.handleCreate = async (req, res) => {
    req.body.password = md5(req.body.password);

    const emailExits = await Accounts.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (emailExits) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
    } else {
        const record = new Accounts(req.body);
        await record.save();

        req.flash("success", "Đã tạo thành công tài khoản!");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const record = await Accounts.findOne({
            _id: req.params.id,
            deleted: false,
        }).select("fullName email phone avatar status role_id");
        const roles = await Roles.find({ deleted: false });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            record: record,
            roles: roles,
        });
    } catch (error) {
        req.flash("error", "Không tồn tại tài khoản này");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.handleEdit = async (req, res) => {
    try {
        const emailExits = await Accounts.findOne({
            _id: { $ne: req.params.id },
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

            await Accounts.updateOne({ _id: req.params.id }, req.body);
            req.flash("success", `Đã cập nhật thành công tài khoản`);
            res.redirect(
                `${systemConfig.prefixAdmin}/accounts/detail/${req.params.id}`
            );
            return;
        }
    } catch (error) {
        req.flash("error", `Cập nhật không thành công tài khoản`);
    }

    res.redirect("back");
};

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    const record = await Accounts.findOne({
        _id: req.params.id,
        deleted: false,
    });
    const role = await Roles.findOne({
        _id: record.role_id,
        deleted: false,
    });

    res.render("admin/pages/accounts/detail", {
        pageTitle: "Chi tiết tài khoản",
        record: record,
        role: role,
    });
};

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
    await Accounts.updateOne(
        { _id: req.params.id },
        { deleted: true, deletedAt: new Date() }
    );

    req.flash("success", "Đã xóa thành công tài khoản");
    res.redirect("back");
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    await Accounts.updateOne(
        { _id: req.params.id },
        { status: req.params.status }
    );
    req.flash("success", "Cập nhật trạng thái tài khoản thành công");

    res.redirect("back");
};

// [PATCH] /admin/accounts/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
            await Accounts.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} tài khoản`
            );
            break;
        case "inactive":
            await Accounts.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} tài khoản`
            );
            break;
        case "delete-all":
            await Accounts.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            req.flash("success", `Xóa thành công ${ids.length} tài khoản`);
            break;
        default:
            res.json({ message: "Action is invalid" });
    }

    res.redirect("back");
};
