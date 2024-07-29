const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/product");

module.exports.requireUser = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    if (tokenUser) {
        const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: "active",
        }).select("-password");

        if (user) {
            res.locals.user = user;

            const cart = await Cart.findById(req.cookies.cartId);

            if (cart.products.length > 0) {
                for (const product of cart.products) {
                    const productId = product.product_id;
                    const productInfo = await Product.findOne({
                        _id: productId,
                        deleted: false,
                    }).select("title thumbnail price discountPercentage");

                    productInfo.priceNew =
                        productHelper.priceNewProduct(productInfo);
                    product.productInfo = productInfo;
                    product.totalPrice = (
                        parseFloat(product.productInfo.priceNew) *
                        product.quantity
                    ).toFixed(2);
                }
            }

            cart.totalPrice = cart.products
                .reduce((total, item) => {
                    return total + parseFloat(item.totalPrice);
                }, 0)
                .toFixed(2);

            res.locals.cart = cart;
        }
    }

    next();
};
