const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const dustbinRoutes = require("./dustbin.route");
const productCategoryRoutes = require("./productCategory.route");

module.exports = (app) => {
    app.use(systemConfig.prefixAdmin + "/dashboard", dashboardRoutes);
    app.use(systemConfig.prefixAdmin + "/products", productRoutes);
    app.use(
        systemConfig.prefixAdmin + "/products-category",
        productCategoryRoutes
    );
    app.use(systemConfig.prefixAdmin + "/dustbin", dustbinRoutes);
};
