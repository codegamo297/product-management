const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    const find = {
        deleted: false,
    };

    if (req.query.status) find.status = req.query.status;

    // Tìm kiếm sản phẩm
    const objSearch = searchHelper(req.query);

    if (objSearch.regexKeyword) find.title = objSearch.regexKeyword;

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    // Truy cập db
    const records = await ProductCategory.find(find).sort(sort);
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/productCategory/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
    });
};

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    await ProductCategory.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("back");
};

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(",");

    switch (type) {
        case "active":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`
            );
            break;
        case "inactive":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`
            );
            break;
        case "delete-all":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (let item of ids) {
                let [id, position] = item.split("-");

                position = parseInt(position);
                await ProductCategory.updateOne(
                    { _id: id },
                    { position: position }
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

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/productCategory/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords,
    });
};

// [POST] /admin/products-category/store
module.exports.handleCreate = async (req, res) => {
    try {
        if (req.body.position === "") {
            const count = await ProductCategory.countDocuments();

            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        const record = new ProductCategory(req.body);
        await record.save();

        req.flash("success", `Đã thêm thành công 1 danh mục sản phẩm`);
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const record = await ProductCategory.findOne({
            deleted: false,
            _id: req.params.id,
        });

        const records = await ProductCategory.find({
            deleted: false,
        });

        const newRecords = createTreeHelper.tree(records);

        res.render(`admin/pages/productCategory/edit`, {
            pageTitle: "Sửa danh mục sản phẩm",
            record: record,
            records: newRecords,
        });
    } catch (error) {
        req.flash("error", "Không tồn tại danh mục sản phẩm này");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

// [PATCH] /admin/products-category/:id
module.exports.handleEditProductCategory = async (req, res) => {
    req.body.position = parseInt(req.body.position);

    try {
        await ProductCategory.updateOne(
            {
                _id: req.params.id,
            },
            req.body
        );

        req.flash("success", `Đã cập nhật thành công sản phẩm`);
    } catch (error) {
        req.flash("error", `Cập nhật không thành công sản phẩm`);
    }

    res.redirect(
        `${systemConfig.prefixAdmin}/products-category/detail/${req.params.id}`
    );
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const record = await ProductCategory.findOne({
            deleted: false,
            _id: req.params.id,
        });
        let parentRecord;
        if (record.parent_id) {
            parentRecord = await ProductCategory.findOne({
                deleted: false,
                _id: record.parent_id,
            });
        }

        res.render(`admin/pages/productCategory/detail`, {
            pageTitle: "Chi tiết danh mục sản phẩm",
            record: record,
            parentRecord: parentRecord,
        });
    } catch (error) {
        req.flash("error", "Không tồn tại danh mục sản phẩm này");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};
