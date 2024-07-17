const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({ position: "desc" });

    const newProducts = productHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts,
    });
};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const product = await Product.findOne({
            status: "active",
            deleted: false,
            slug: req.params.slug,
        });

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        res.redirect(`/products`);
    }
};
