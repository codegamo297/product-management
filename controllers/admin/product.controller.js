const Product = require("../../models/product.model");
const regex = require("../../helper/regex");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    let keyword = "";

    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: "",
        },
        {
            name: "Hoạt động",
            status: "active",
            class: "",
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: "",
        },
    ];

    if (req.query.status) {
        const index = filterStatus.findIndex(
            (item) => item.status === req.query.status
        );
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex((item) => item.status === "");
        filterStatus[index].class = "active";
    }

    if (req.query.status) find.status = req.query.status;
    if (req.query.keyword) {
        keyword = req.query.keyword;

        const regexKeyword = new RegExp(
            regex.notAllowSpecialSymbols(keyword),
            "i"
        );

        find.title = regexKeyword;
    }

    const products = await Product.find(find);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
    });
};
