const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product");
const productCategoryHelper = require("../../helpers/product-category");

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
        let productCategory;

        if (product.product_category_id) {
            productCategory = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false,
            });

            product.category = productCategory;
        }

        product.priceNew = productHelper.priceNewProduct(product);

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        res.redirect(`/products`);
    }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({
            deleted: false,
            slug: req.params.slugCategory,
        });

        const subCategories = await productCategoryHelper.getSubCategory(
            category.id
        );
        const subCategoryIds = subCategories.map((item) => item.id);

        const products = await Product.find({
            deleted: false,
            product_category_id: {
                $in: [category.id, ...subCategoryIds],
            },
        }).sort({ position: "desc" });

        const newProducts = productHelper.priceNewProducts(products);

        res.render("client/pages/products/index", {
            pageTitle: category.title,
            products: newProducts,
        });
    } catch (error) {
        res.redirect("/");
    }
};
