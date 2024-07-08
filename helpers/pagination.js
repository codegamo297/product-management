const systemConfig = require("../config/system");

module.exports = (objPagination, query, countProducts, page, res, next) => {
    const totalPage = Math.ceil(countProducts / objPagination.limitItem);

    if (query.page) objPagination.currentPage = parseInt(query.page);

    objPagination.skip =
        (objPagination.currentPage - 1) * objPagination.limitItem;
    objPagination.totalPage = totalPage;

    if (objPagination.currentPage > objPagination.totalPage) {
        objPagination.currentPage = objPagination.totalPage;
        objPagination.redirectUrl = `${systemConfig.prefixAdmin}/${page}?page=${objPagination.currentPage}`;
    }

    return objPagination;
};
