const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        // Tạo giỏ hàng
        const maxAgeCookie = 24 * 3600 * 1000 * 30;
        const cart = new Cart({
            expireAt: new Date(Date.now() + maxAgeCookie),
        });

        await cart.save();

        res.cookie("cartId", cart.id, {
            maxAge: maxAgeCookie,
        });
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId,
        });

        cart.totalQuantity = cart.products.reduce(
            (total, product) => total + product.quantity,
            0
        );

        res.locals.miniCart = cart;
    }

    next();
};
