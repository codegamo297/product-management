const Products = require("../../models/product.model");
const productHelper = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Products.find({
        deleted: false,
        featured: "1",
        status: "active",
    }).limit(6);
    const newProductsFeatured =
        productHelper.priceNewProducts(productsFeatured);

    // Lấy ra sản phẩm mới nhất
    const productsNew = await Products.find({
        deleted: false,
        status: "active",
    })
        .sort({ position: "desc" })
        .limit(6);
    const newProductsNew = productHelper.priceNewProducts(productsNew);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew,
    });
};
