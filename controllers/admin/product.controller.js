const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // Bộ lọc sản phẩm
    const filterStatus = filterStatusHelper(req.query);
    const find = {
        deleted: false,
    };
    if (req.query.status) find.status = req.query.status;

    // Tìm kiếm sản phẩm
    const objSearch = searchHelper(req.query);
    if (objSearch.regexKeyword) find.title = objSearch.regexKeyword;

    // Truy cập db
    const products = await Product.find(find);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
    });
};
