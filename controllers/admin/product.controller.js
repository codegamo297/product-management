const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Accounts = require("../../models/account.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

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
        countProducts,
        "products",
        res
    );

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    // Truy cập db
    const products = await Product.find(find)
        .sort(sort)
        .limit(objPagination.limitItem)
        .skip(objPagination.skip);

    for (const product of products) {
        // Lấy ra in4 người tạo
        const user = await Accounts.findOne({
            _id: product.createdBy.account_id,
        });

        if (user) {
            product.accountFullName = user.fullName;
        }

        // Lấy ra in4 người cập nhật gần nhất
        const updatedBy = product.updatedBy.slice(-1)[0];

        if (updatedBy) {
            const userUpdated = await Accounts.findOne({
                _id: updatedBy.account_id,
            });

            updatedBy.accountFullName = userUpdated.fullName;
        }
    }

    if (objPagination.redirectUrl) {
        return res.redirect(objPagination.redirectUrl);
    }

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
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    };

    await Product.updateOne(
        { _id: req.params.id },
        { status: req.params.status, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", "Cập nhật trạng thái sản phẩm thành công");

    res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
    };

    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "active", $push: { updatedBy: updatedBy } }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`
            );
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive", $push: { updatedBy: updatedBy } }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`
            );
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: true,
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                }
            );
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (let item of ids) {
                let [id, position] = item.split("-");

                position = parseInt(position);
                await Product.updateOne(
                    { _id: id },
                    { position: position, $push: { updatedBy: updatedBy } }
                );
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
        {
            deleted: true,
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            },
        }
    );
    req.flash("success", `Xóa thành công sản phẩm`);

    res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const records = await ProductCategory.find({
        deleted: false,
    });
    const newCategory = createTreeHelper.tree(records);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory,
    });
};

// [POST] /admin/products/store
module.exports.handleCreateProduct = async (req, res) => {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);

        if (req.body.position === "") {
            const countProducts = await Product.countDocuments();

            req.body.position = countProducts + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        req.body.createdBy = {
            account_id: res.locals.user.id,
        };

        const product = new Product(req.body);
        await product.save();
        req.flash("success", `Đã thêm thành công 1 sản phẩm`);

        res.redirect(`${systemConfig.prefixAdmin}/products`);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const product = await Product.findOne(find);

        const records = await ProductCategory.find({
            deleted: false,
        });
        const newCategory = createTreeHelper.tree(records);

        res.render("admin/pages/products/edit", {
            pageTitle: "Trang sửa sản phẩm",
            product: product,
            category: newCategory,
        });
    } catch (error) {
        req.flash("error", "Không tồn tại sản phẩm này");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.handleEditProduct = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date(),
        };

        await Product.updateOne(
            {
                _id: req.params.id,
            },
            { ...req.body, $push: { updatedBy: updatedBy } }
        );

        req.flash("success", `Đã cập nhật thành công sản phẩm`);
    } catch (error) {
        req.flash("error", `Cập nhật không thành công sản phẩm`);
    }

    res.redirect(
        `${systemConfig.prefixAdmin}/products/detail/${req.params.id}`
    );
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const product = await Product.findOne(find);

        let productCategory;
        if (product.product_category_id) {
            productCategory = await ProductCategory.findOne({
                _id: product.product_category_id,
            });
        }

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product,
            productCategory: productCategory,
        });
    } catch (error) {
        req.flash("error", "Không tồn tại sản phẩm này");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
