
class I18n {
    static lang = Intl.DateTimeFormat().resolvedOptions().locale;
    static lang_json = require(`./translation/${I18n.lang}.json`);
    static T(str) {
        let result = I18n.lang_json[str];
        if (result === void 0) {
            result = str;
        }
        return result;
    }
}
module.exports = I18n;