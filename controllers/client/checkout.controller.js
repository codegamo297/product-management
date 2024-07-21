const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productHelper = require("../../helpers/product");

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cart = await Cart.findById(req.cookies.cartId);

    if (cart.products.length > 0) {
        for (const product of cart.products) {
            const productId = product.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
                deleted: false,
            }).select("title thumbnail slug price discountPercentage");

            productInfo.priceNew = productHelper.priceNewProduct(productInfo);
            product.productInfo = productInfo;
            product.totalPrice = (
                parseFloat(product.productInfo.priceNew) * product.quantity
            ).toFixed(2);
        }
    }

    cart.totalPrice = cart.products
        .reduce((total, item) => {
            return total + parseFloat(item.totalPrice);
        }, 0)
        .toFixed(2);

    res.render("client/pages/checkout/index.pug", {
        pageTitle: "Đặt hàng",
        cartDetail: cart,
    });
};

// [POST] /checkout/order
module.exports.handleOrder = async (req, res) => {
    const userInfo = req.body;
    const cartId = req.cookies.cartId;
    const cart = await Cart.findById(cartId);
    const products = [];

    for (const product of cart.products) {
        const objProduct = {
            product_id: product.product_id,
            quantity: product.quantity,
            price: 0,
            discountPercentage: 0,
        };

        const productInfo = await Product.findOne({
            _id: product.product_id,
            deleted: false,
        }).select("price discountPercentage");

        objProduct.price = productInfo.price;
        objProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objProduct);
    }

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
    };

    const order = new Order(orderInfo);
    order.save();

    await Cart.updateOne({ _id: cartId }, { products: [] });

    res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const order = await Order.findById(req.params.orderId);

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id,
        }).select("title thumbnail");

        product.productInfo = productInfo;
        productInfo.priceNew = productHelper.priceNewProduct(product);
        product.totalPrice = (
            parseFloat(product.productInfo.priceNew) * product.quantity
        ).toFixed(2);
    }

    order.totalPrice = order.products
        .reduce((sum, item) => {
            return sum + parseFloat(item.totalPrice);
        }, 0)
        .toFixed(2);

    res.render("client/pages/checkout/success.pug", {
        pageTitle: "Đặt hàng thành công",
        order: order,
    });
};
