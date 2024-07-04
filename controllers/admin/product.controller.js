const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // Bộ lọc sản phẩm
    const filterStatus = filterStatusHelper(req.query);
    const find = {
        deleted: false,
    };

    if (req.query.status) find.status = req.query.status;

    // Tìm kiếm sản phẩm
    const objSearch = searchHelper(req.query);

    if (objSearch.regexKeyword) find.title = objSearch.regexKeyword;

    // Phân trang
    const countProducts = await Product.countDocuments(find);

    const objPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProducts
    );

    // Truy cập db
    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objPagination.limitItem)
        .skip(objPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
        pagination: objPagination,
    });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    await Product.updateOne(
        { _id: req.params.id },
        { status: req.params.status }
    );
    req.flash("success", "Cập nhật trạng thái sản phẩm thành công");

    res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`
            );
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`
            );
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (let item of ids) {
                let [id, position] = item.split("-");

                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash(
                "success",
                `Đã thay đổi vị trí ${ids.length} sản phẩm thành công`
            );

            break;
        default:
            res.json({ message: "Action is invalid" });
    }

    res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
    await Product.updateOne(
        { _id: req.params.id },
        { deleted: true, deletedAt: new Date() }
    );
    req.flash("success", `Xóa thành công sản phẩm`);

    res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
};

// [POST] /admin/products/store
module.exports.handleCreateProduct = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
        const countProducts = await Product.countDocuments();

        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    if (req.file) req.body.thumbnail = `/uploads/${req.file.filename}`;

    const product = new Product(req.body);
    await product.save();
    req.flash("success", `Đã thêm thành công 1 sản phẩm`);

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Trang sửa sản phẩm",
            product: product,
        });
    } catch (error) {
        req.flash("errorNotExits", "Không tồn tại sản phẩm này");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.handleEditProduct = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) req.body.thumbnail = `/uploads/${req.file.filename}`;

    try {
        await Product.updateOne(
            {
                _id: req.params.id,
            },
            req.body
        );

        req.flash("successUpdate", `Đã cập nhật thành công sản phẩm`);
    } catch (error) {
        req.flash("errorUpdate", `Cập nhật không thành công sản phẩm`);
    }

    res.redirect("back");
};
