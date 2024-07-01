const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            break;
        case "change-position":
            for (let item of ids) {
                let [id, position] = item.split("-");

                position = parseInt(position);
                await Product.updateOne(
                    { _id: id },
                    { position: position, updatedAt: new Date() }
                );
            }

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

    res.redirect("back");
};
