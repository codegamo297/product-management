module.exports.handleCreateProduct = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", `Vui lòng nhập tiêu đề`);
        res.redirect("back");
        return;
    }

    if (!req.body.price) {
        req.flash("error", `Vui lòng nhập giá của sản phẩm`);
        res.redirect("back");
        return;
    }

    next();
};
