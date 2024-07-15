const Product = require("../../models/product.model");
const Accounts = require("../../models/account.model");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/dustbin
module.exports.index = async (req, res) => {
    const find = {
        deleted: true,
    };

    // Phân trang
    const countProducts = await Product.countDocuments(find);

    const objPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProducts,
        "dustbin",
        res
    );

    // Truy cập db
    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objPagination.limitItem)
        .skip(objPagination.skip);

    if (objPagination.redirectUrl) {
        return res.redirect(objPagination.redirectUrl);
    }

    for (const product of products) {
        const user = await Accounts.findOne({
            _id: product.deletedBy.account_id,
        });

        if (user) {
            product.accountFullName = user.fullName;
        }
    }

    res.render("admin/pages/dustbin/index", {
        pageTitle: "Thùng rác",
        products: products,
        pagination: objPagination,
    });
};

// [DELETE] /admin/dustbin/delete/:id
module.exports.delete = async (req, res) => {
    await Product.deleteOne({ _id: req.params.id });
    req.flash("success", `Đã xóa vĩnh viễn sản phẩm`);

    res.redirect("back");
};

// [PATCH] /admin/dustbin/restore/:id
module.exports.restore = async (req, res) => {
    await Product.updateOne({ _id: req.params.id }, { deleted: false });
    req.flash("success", `Khôi phục thành công sản phẩm`);

    res.redirect("back");
};

// [PATCH] /admin/dustbin/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "restore-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: false });
            req.flash("success", `Khôi phục thành công ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Product.deleteMany({ _id: { $in: ids } });
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        default:
            res.json({ message: "Action is invalid" });
    }

    res.redirect("back");
};
