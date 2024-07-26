const SettingGeneral = require("../../models/setting-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral,
    });
};

// [PATCH] /admin/settings/general
module.exports.handleGeneral = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    if (!settingGeneral) {
        const record = new SettingGeneral(req.body);
        await record.save();
    } else {
        await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
    }

    res.redirect("back");
};
