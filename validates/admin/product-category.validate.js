module.exports.handleCreate = (req, res, next) => {
    if (!req.body.title) {
        req.flash("errorTitle", `Vui lòng nhập tiêu đề`);
        res.redirect("back");
        return;
    }

    next();
};
