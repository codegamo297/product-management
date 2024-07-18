const regex = {
    notAllowSpecialSymbols: function (string) {
        return string.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/g, "");
    },
    email: function (string) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(string);
    },
    phone: function (string) {
        const regex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        return regex.test(string);
    },
};

module.exports = regex;
