const regex = require("./regex");

module.exports = (query) => {
    const objSearch = {
        keyword: "",
    };

    if (query.keyword) {
        objSearch.keyword = query.keyword;

        const regexKeyword = new RegExp(
            regex.notAllowSpecialSymbols(objSearch.keyword),
            "i"
        );

        objSearch.regexKeyword = regexKeyword;
    }

    return objSearch;
};
