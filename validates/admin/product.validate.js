module.exports.post = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error-title", `Vui lòng nhập tiêu đề`);
        res.redirect("back");
        return;
    }

    // if (parseInt(req.body.price === 0)) {
    //     req.flash("error-price", `Vui lòng nhập giá của sản phẩm`);
    //     res.redirect("back");
    //     return;
    // }

    next();
};
