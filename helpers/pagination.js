module.exports = (objPagination, query, countProducts) => {
    const totalPage = Math.ceil(countProducts / objPagination.limitItem);

    if (query.page) objPagination.currentPage = parseInt(query.page);

    objPagination.skip =
        (objPagination.currentPage - 1) * objPagination.limitItem;
    objPagination.totalPage = totalPage;

    return objPagination;
};
