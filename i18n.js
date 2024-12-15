
class I18n {
    
    static lang_json = I18n.load_lang_resource();
    static T(str) {
        let result = I18n.lang_json[str];
        if (result === void 0) {
            result = str;
        }
        return result;
    }
    static load_lang_resource(){
        const lang = Intl.DateTimeFormat().resolvedOptions().locale;
        if(typeof(process) === 'object'){
            // Runtime is NodeJS
            return require(`./translation/${lang}.json`);
        }
        else if(typeof($app)=== 'object' && $app?.info?.bundleID==='app.cyan.jsbox'){
            // Runtime is JSBox
            return JSON.parse($data({
                path:`./scripts/Iec104.js/translation/${lang}.json`
            }).string);
        }
    }
}
module.exports = I18n.T;