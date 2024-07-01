const Product = require("../../models/product.model");
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
        countProducts
    );

    // Truy cập db
    const products = await Product.find(find)
        .limit(objPagination.limitItem)
        .skip(objPagination.skip);

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
