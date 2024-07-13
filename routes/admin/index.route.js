const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const dustbinRoutes = require("./dustbin.route");
const productCategoryRoutes = require("./productCategory.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");

module.exports = (app) => {
    app.use(systemConfig.prefixAdmin + "/dashboard", dashboardRoutes);
    app.use(systemConfig.prefixAdmin + "/products", productRoutes);
    app.use(
        systemConfig.prefixAdmin + "/products-category",
        productCategoryRoutes
    );
    app.use(systemConfig.prefixAdmin + "/dustbin", dustbinRoutes);
    app.use(systemConfig.prefixAdmin + "/roles", roleRoutes);
    app.use(systemConfig.prefixAdmin + "/accounts", accountRoutes);
    app.use(systemConfig.prefixAdmin + "/auth", authRoutes);
};
