const AsduDict = require('./data-types/asdu-type');
const InformationObjectFactory = class {
    static createInstance(tid, bytes) {
        return Reflect.construct(AsduDict[tid], [bytes]);
    }
    static getDescription(tid) {
        if (tid != undefined) {
            if (Array.isArray(tid)) {
                tid = tid[0];
            }
            return AsduDict[tid].Description;
        }
        else {
            throw new Error("参数非法，tid不能为空");
        }
    }
}
module.exports = InformationObjectFactory