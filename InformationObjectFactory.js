const AsduDict = require('./data-types/asdu-type');
class InformationObjectFactory {
    static CreateInstance(tid, stream) {
        return Reflect.construct(AsduDict[tid], [stream]);
    }
    static GetDescription(tid) {
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