require('./bytes-ext');
const ByteStream = require('./byte-stream');
const Enums = require('./enum');
const Const = require('./constant');
const InformationObject = require('./data-types/asdu-type');
const InformationObjectFactory = require('./InformationObjectFactory');

const Iec104Packet = class {

    /**
     * @description Raw bytes store here, readonly
     * @author Tsccai
     * @date 2023-12-06
     * @returns {Array}
     */
    get RawBytes() { return this.#rawBytes; }
    #rawBytes = [];

    #stream = null;

    /**
     * @description APDU length, readonly
     * @author Tsccai
     * @date 2023-12-06
     * @returns {Number}
     */
    get ApduLength() { return this.#apduLength; }
    #apduLength = 0;   // 1B

    /**
     * @description Frame format, readonly, can be one of I-Format, S-Format, U-Format
     * @author Tsccai
     * @date 2023-12-06
     * @returns {String}
     */
    get FrameFormat() { return this.#frameFormat; }
    #frameFormat = "Unknown";    // Depends on Control Field

    /**
     * @description Control Field object, readonly
     * @author Tsccai
     * @date 2023-12-06
     * @returns {Object}
     */
    get ControlField() { return this.#controlField; }
    #controlField = {};   // 4B

    // Length of COT, default as 2, may be 1
    #LEN_COT = 2;

    // Length of ASDU address, default as 2, may be 1
    #LEN_ASDU_ADDR = 2;

    // Length of Information object address, default as 3, may be 2
    #LEN_IO_ADDR = 3;

    /**
     * @description ASDU object, readonly
     * @author Tsccai
     * @date 2023-12-06
     * @returns {Object}
     */
    get Asdu() { return this.#asdu; }
    #asdu = {};

    /**
     * @description Constructor of the class, it will verify the arguments, 
     * initialize LEN_COT, LEN_ASDU_ADDR, LEN_IO_ADDR, 
     * and then parse the packet bytes to Iec104Packet object
     * @author Tsccai
     * @date 2023-12-06
     * @param {Array} bytes Packet array, made up by UInt8
     * @param {Object} settings Example: {cotLength:2, asduAddrLength:2, ioAddrLength:3}
     */
    constructor(bytes, settings) {
        for (let b of bytes) {
            if (b > 0xFF || b < 0) {
                throw new Error(`${b}不是有效的字节`);
            }
        }
        this.#rawBytes = bytes;
        this.#stream = new ByteStream(bytes);
        if (settings != undefined) {
            this.#LEN_COT = settings.cotLength || this.#LEN_COT;
            this.#LEN_ASDU_ADDR = settings.asduAddrLength || this.#LEN_ASDU_ADDR;
            this.#LEN_IO_ADDR = settings.ioAddrLength || this.#LEN_IO_ADDR;
        }
        this.#parsePacket();
    }

    toString() {
        let str =
            `APDU Length: ${this.ApduLength}, Frame Format: ${this.FrameFormat}\n` +
            `CF: {${this.ControlField.toString()}}\n` +
            `ASDU:{ \n` +
            `    TID: ${this.Asdu.Type.Description}\n` +
            `    Number of Objects: ${this.Asdu.NumberOfObjects}\n` +
            `    Is Sequence: ${this.Asdu.IsSequence}\n` +
            `    COT: ${this.Asdu.CauseOfTransfer.Description} \n` +
            `    ASDU Addr: ${this.Asdu.AsduAddr} \n` +
            `    Information Object Addr: [${this.Asdu.InformationObjectAddr}] \n` +
            `    Information Object: [${this.Asdu.InformationObjects}] \n` +
            `}`
        return str;
    }


    /**
     * @description Parse the whole packet, invoke automatically in constructor()
     * @author Tsccai
     * @date 2023-12-06
     */
    #parsePacket() {
        let bytes = [];

        // Check the start byte
        bytes = this.#stream.Read(Const.LEN_START_BYTE);
        if (bytes.length < 1 || bytes[0] != Const.START_BYTE) {
            throw new Error(`启动字节不是${Const.START_BYTE}，不是合法的IEC-60870-5-104报文。`);
        }

        // Read & check length of APDU
        bytes = this.#stream.Read(Const.LEN_APDU_LENGTH);
        this.#apduLength = bytes.toUInt();
        if (this.#stream.Length != this.ApduLength + Const.LEN_START_BYTE + Const.LEN_APDU_LENGTH) {
            throw new Error("APDU长度与实际不符。");
        }

        // Read Control Fields
        bytes = this.#stream.Read(Const.LEN_CF);
        this.#controlField = this.#parseControlField(bytes);

        if (this.FrameFormat == "I-Format") {
            this.#asdu = this.#parseAsdu();
        }
    }

    /**
     * @description Parse the Control Field of the packet, invoke in #parsePacket()
     * @author Tsccai
     * @date 2023-12-06
     * @param {Array} bytes The Control Field byte array
     */
    #parseControlField(bytes) {
        let cf={};
        // Check flag1 and flag2, the 1st and 3rd byte
        let flag1 = bytes[0] & Const.MASK_CF;
        let flag2 = bytes[2] & (Const.MASK_CF >> 1);
        if (flag1 % 2 == 0 && flag2 == 0) {
            // Check flag2, in this case, it's the 3rd byte
            this.#frameFormat = "I-Format";
            let sendSqNum = bytes.readBytes(2, 0).toUInt() >> 1;
            let receiveSqNum = bytes.readBytes(2, 2).toUInt() >> 1;

            cf= { SendSqNum: sendSqNum, ReceiveSqNum: receiveSqNum };
            
        }
        else if (flag1 == 1 && flag2 == 0 && bytes[0] == 1 && bytes[1] == 0) {
            this.#frameFormat = "S-Format";
            let receiveSqNum = bytes.readBytes(2, 2).toUInt() >> 1;
            cf= { ReceiveSqNum: receiveSqNum };

        }
        else if (flag1 == 3 && bytes[1] * bytes[2] * bytes[3] == 0) {
            this.#frameFormat = "U-Format";
            cf={ Sigalling: Enums.UFormatSignalling.toString(bytes[0]) };
        }
        else {
            throw new Error("未知的帧格式。");
        }
        cf.toString=function(){
            let result ='';
            for(let key in this){
                if(typeof(this[key])==='function'){
                    continue;
                }
                result+=`${key}: ${this[key]}, `;
            }
            return result.substring(0,result.length-2);
        }
        return cf;
    }

    /**
     * @description Parse the ASDU of the packet, invoke in #parsePacket()
     * @author Tsccai
     * @date 2023-12-06
     */
    #parseAsdu() {
        let result = {};
        result.toString = function () { return result }

        // Read Type identification
        let bytes = this.#stream.Read(Const.LEN_ASDU_TYPE);
        result.Type = {
            RawBytes: bytes, Description: InformationObjectFactory.GetDescription(bytes)
        };


        bytes = this.#stream.Read(Const.LEN_NUM_OF_OBJECT);
        let tmp = bytes.toUInt();
        result.NumberOfObjects = tmp & Const.MASK_NUM_OF_OBJECT;
        result.IsSequence = (tmp & ~Const.MASK_NUM_OF_OBJECT) != 0;

        bytes = this.#stream.Read(this.#LEN_COT);
        tmp = [bytes.shift()].toUInt();
        result.CauseOfTransfer = { Description: Enums.CotType.toString(tmp & Const.MASK_COT) };


        result.CauseOfTransfer.IsTest = (tmp & (1 << 7)) > 0;
        result.CauseOfTransfer.IsPositive = (tmp & (1 << 6)) > 0;
        if (this.#LEN_COT == 2) {
            result.CauseOfTransfer.OriginatorAddr = bytes.toUInt();
        }

        bytes = this.#stream.Read(this.#LEN_ASDU_ADDR);
        result.AsduAddr = bytes.toUInt();
        result.InformationObjectAddr = [];
        result.InformationObjects = [];
        const tid = result.Type.RawBytes.toUInt();



        if (result.IsSequence) {
            result.InformationObjectAddr.push(this.#stream.Read(this.#LEN_IO_ADDR).toUInt());
            // Follow with Information Objects without address 
            for (let i = 0; i < result.NumberOfObjects; i++) {
                const obj = this.#createInformationObject(tid);
                result.InformationObjects.push(obj.Value);
            }
        }
        else {
            for (let i = 0; i < result.NumberOfObjects; i++) {
                result.InformationObjectAddr.push(this.#stream.Read(this.#LEN_IO_ADDR).toUInt());
                const obj = this.#createInformationObject(tid);
                result.InformationObjects.push(obj.Value);
            }
        }
        return result;
    }
    #createInformationObject(tid) {
        const len = InformationObject[tid].ByteLength;

        const infoObj = InformationObjectFactory.CreateInstance(tid, this.#stream);
        return infoObj;
    }
}



module.exports = Iec104Packet;