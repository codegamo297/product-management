const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelper = require("../../helpers/product");

// [GET] /cart
module.exports.index = async (req, res) => {
    const carts = await Cart.findById(req.cookies.cartId);

    if (carts.products.length > 0) {
        for (const item of carts.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
                deleted: false,
            }).select("title thumbnail slug price discountPercentage");

            productInfo.priceNew = productHelper.priceNewProduct(productInfo);
            item.productInfo = productInfo;
            item.totalPrice = (
                parseFloat(item.productInfo.priceNew) * item.quantity
            ).toFixed(2);
        }
    }

    carts.totalPrice = carts.products
        .reduce((total, item) => {
            return total + parseFloat(item.totalPrice);
        }, 0)
        .toFixed(2);

    res.render("client/pages/cart/index.pug", {
        pageTitle: "Giỏ hàng",
        cartDetail: carts,
    });
};

// [POST] /cart/add/:productId
module.exports.handleAdd = async (req, res) => {
    const quantity = parseInt(req.body.quantity);
    const { productId } = req.params;
    const cartId = req.cookies.cartId;
    const objCart = {
        product_id: productId,
        quantity: quantity,
    };

    const cart = await Cart.findOne({ _id: cartId });

    const existProductInCart = cart.products.find((product) => {
        return product.product_id === productId;
    });

    if (existProductInCart) {
        const quantityNew = existProductInCart.quantity + quantity;
        await Cart.updateOne(
            { _id: cartId, "products.product_id": productId },
            { $set: { "products.$.quantity": quantityNew } }
        );
    } else {
        await Cart.updateOne({ _id: cartId }, { $push: { products: objCart } });
    }

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    res.redirect("back");
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    try {
        const { productId } = req.params;
        const cartId = req.cookies.cartId;

        await Cart.updateOne(
            { _id: cartId },
            { $pull: { products: { product_id: productId } } }
        );

        req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Sản phẩm trong giỏ hàng không tồn tại");
        res.redirect("/cart");
    }
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    try {
        const { productId, quantity } = req.params;
        const cartId = req.cookies.cartId;

        await Cart.updateOne(
            { _id: cartId, "products.product_id": productId },
            { $set: { "products.$.quantity": quantity } }
        );

        req.flash("success", "Đã cập nhật số lượng sản phẩm trong giỏ hàng");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Sản phẩm trong giỏ hàng không tồn tại");
        res.redirect("/cart");
    }
};
