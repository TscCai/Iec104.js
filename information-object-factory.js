const InformationObject = require('./data-types/asdu-type');
const InformationObjectFactory = class {

    static createInformationObject(tid, bytes) {
        return Reflect.construct(InformationObject[tid], [bytes]);
    }

}
module.exports = InformationObjectFactory