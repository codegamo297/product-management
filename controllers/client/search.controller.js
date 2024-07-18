const Product = require("../../models/product.model");
const searchHelper = require("../../helpers/search");
const productHelper = require("../../helpers/product");

// [GET] /search
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
        status: "active",
    };

    // Tìm kiếm sản phẩm
    const objSearch = searchHelper(req.query);
    if (objSearch.regexKeyword) find.title = objSearch.regexKeyword;

    // Truy cập db
    const products = await Product.find(find);
    const newProducts = productHelper.priceNewProducts(products);

    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        products: newProducts,
        keyword: objSearch.keyword.trim(),
    });
};
