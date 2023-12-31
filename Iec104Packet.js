require('./bytes-ext');
const Enums = require('./enum');
const Const = require('./constant');
const InformationObject = require('./data-types/asdu-type');
const InformationObjectFactory = require('./InformationObjectFactory');

const Iec104Packet = class {
    // Internal pointer to mark where the bytes are now.
    #streamPointer = 0;

    /**
     * @description Raw bytes store here, readonly
     * @author Tsccai
     * @date 2023-12-06
     * @returns {Array}
     */
    get RawBytes() { return this.#rawBytes; }
    #rawBytes = [];

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
        if (settings != undefined) {
            this.#LEN_COT = settings.cotLength || this.#LEN_COT;
            this.#LEN_ASDU_ADDR = settings.asduAddrLength || this.#LEN_ASDU_ADDR;
            this.#LEN_IO_ADDR = settings.ioAddrLength || this.#LEN_IO_ADDR;
        }
        this.#parsePacket();
    }

    toString(){
        let str  = 
        `APDU Length: ${this.ApduLength}, Frame Format: ${this.FrameFormat}\n`+
        `CF: {${this.ControlField}}\n`+
        `ASDU:{ \n`+
        `    COT: ${this.Asdu.CauseOfTransfer.Description} \n`+
        `}`
        return str;
    }

    /**
     * @description Read #rawBytes as stream form
     * @author Tsccai
     * @date 2023-12-06
     * @param {Number} length The length will read, Integer
     * @returns {Array}
     */
    #readByteStream(length) {
        let bytes = this.#rawBytes.readBytes(length, this.#streamPointer);
        this.#streamPointer += length;
        return bytes;
    }

    /**
     * @description Parse the whole packet, invoke automatically in constructor()
     * @author Tsccai
     * @date 2023-12-06
     */    
    #parsePacket() {
        let bytes = [];

        // Check the start byte
        bytes = this.#readByteStream(Const.LEN_START_BYTE);
        if (bytes.length < 1 || bytes[0] != Const.START_BYTE) {
            throw new Error(`启动字节不是${Const.START_BYTE}，不是合法的IEC-60870-5-104报文。`);
        }

        // Read & check length of APDU
        bytes = this.#readByteStream(Const.LEN_APDU_LENGTH);
        this.#apduLength = bytes.toUInt();
        if (this.#rawBytes.length != this.ApduLength + Const.LEN_START_BYTE + Const.LEN_APDU_LENGTH) {
            throw new Error("APDU长度与实际不符。");
        }

        // Read Control Fields
        bytes = this.#readByteStream(Const.LEN_CF);
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
        // Check flag1 and flag2, the 1st and 3rd byte
        let flag1 = bytes[0] & Const.MASK_CF;
        let flag2 = bytes[2] & (Const.MASK_CF >> 1);
        if (flag1 % 2 == 0 && flag2 == 0) {
            // Check flag2, in this case, it's the 3rd byte
            this.#frameFormat = "I-Format";
            let sendSqNum = bytes.readBytes(2, 0).toUInt() >> 1;
            let receiveSqNum = bytes.readBytes(2, 2).toUInt() >> 1;
            return { SendSqNum: sendSqNum, ReceiveSqNum: receiveSqNum };
        }
        else if (flag1 == 1 && flag2 == 0 && bytes[0] == 1 && bytes[1] == 0) {
            this.#frameFormat = "S-Format";
            let receiveSqNum = bytes.readBytes(2, 2).toUInt() >> 1;
            return { ReceiveSqNum: receiveSqNum };
        }
        else if (flag1 == 3 && bytes[1] * bytes[2] * bytes[3] == 0) {
            this.#frameFormat = "U-Format";
            return { Sigalling: Enums.UFormatSignalling.toString(bytes[0]) };
        }
        else {
            throw new Error("未知的帧格式。");
        }
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
        let bytes = this.#readByteStream(Const.LEN_ASDU_TYPE);
        result.Type = {
            RawBytes: bytes, Description: InformationObjectFactory.getDescription(bytes)
        };


        bytes = this.#readByteStream(Const.LEN_NUM_OF_OBJECT);
        let tmp = bytes.toUInt();
        result.NumberOfObjects = tmp & Const.MASK_NUM_OF_OBJECT;
        result.IsSequence = (tmp & ~Const.MASK_NUM_OF_OBJECT) != 0;

        bytes = this.#readByteStream(this.#LEN_COT);
        tmp = [bytes.shift()].toUInt();
        result.CauseOfTransfer = { Description: Enums.CotType.toString(tmp & Const.MASK_COT) };


        result.CauseOfTransfer.IsTest = (tmp & (1 << 7)) > 0;
        result.CauseOfTransfer.IsPositive = (tmp & (1 << 6)) > 0;
        if (this.#LEN_COT == 2) {
            result.CauseOfTransfer.OriginatorAddr = bytes.toUInt();
        }

        bytes = this.#readByteStream(this.#LEN_ASDU_ADDR);
        result.AsduAddr = bytes.toUInt();
        result.InformationObjectAddr = [];
        result.InformationObjects = [];
        let tid = result.Type.RawBytes.toUInt();
        if (result.IsSequence) {
            bytes = this.#readByteStream(this.#LEN_IO_ADDR);
            result.InformationObjectAddr.push(bytes.toUInt());

            // Follow with Information Objects without address 
            for (let i = 0; i < result.NumberOfObjects; i++) {

                let len = InformationObject[tid].ByteLength;
                bytes = this.#readByteStream(len);
                result.InformationObjects.push(
                    InformationObjectFactory.createInstance(tid, bytes).Value
                );
            }
        }
        else {
            for (let i = 0; i < result.NumberOfObjects; i++) {
                let len = InformationObject[tid].ByteLength;
                bytes = this.#readByteStream(this.#LEN_IO_ADDR);
                result.InformationObjectAddr.push(bytes.toUInt());
                bytes = this.#readByteStream(len);
                // do sth
                result.InformationObjects.push(
                    InformationObjectFactory.createInstance(tid, bytes).Value
                );
            }
        }


        return result;
    }
}


module.exports = Iec104Packet;