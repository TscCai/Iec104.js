require('./bytes-ext');
const Enums = require('./enum');
const Const = require('./constant');
const AsduFactory = require('./information-object-factory');
const InformationObject = require('./data-types/asdu-type');
const Iec104Packet = class {
    #streamPointer = 0;

    #rawBytes = [];
    get RawBytes() { return this.#rawBytes; }

    #apduLength = 0;   // 1B
    get ApduLength() { return this.#apduLength; }

    #frameFormat = "Unknown";    // Depends on Control Field
    get FrameFormat() { return this.#frameFormat; }

    #controlField = {};   // 4B
    get ControlField() { return this.#controlField; }

    #LEN_COT = 2;
    #LEN_ASDU_ADDR = 2;
    #LEN_IO_ADDR = 3;

    #asdu = {};
    get Asdu() { return this.#asdu; }

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
            // console.log(`cot: ${this.#LEN_COT}, asdu_addr: ${this.#LEN_ASDU_ADDR}, ioa: ${this.#LEN_IO_ADDR}`)
        }

        this.#parsePacket();

    }

    #readByteStream(length, offset = this.#streamPointer) {
        let bytes = this.#rawBytes.readBytes(length, offset);
        this.#streamPointer += length;
        return bytes;
    }

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

        // Read Control fileds
        bytes = this.#readByteStream(Const.LEN_CF);
        this.#controlField = this.#parseControlField(bytes);

        if (this.FrameFormat == "I-Format") {
            this.#asdu = this.#parseAsdu();

        }
    }

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

    #parseAsdu() {
        let result = {};

        // Read Type identification
        let bytes = this.#readByteStream(Const.LEN_ASDU_TYPE);
        result.Type = { RawBytes: bytes, Description: Enums.AsduType.toString(bytes) };

        bytes = this.#readByteStream(Const.LEN_NUM_OF_OBJECT);
        let tmp = bytes.toUInt();
        result.NumberOfObjects = tmp & Const.MASK_NUM_OF_OBJECT;
        result.IsSequence = (tmp & ~Const.MASK_NUM_OF_OBJECT) != 0;

        bytes = this.#readByteStream(this.#LEN_COT);
        tmp = [bytes.shift()].toUInt();
        result.CauseOfTransfer = Enums.CotType.toString(tmp & Const.MASK_COT);


        result.IsTest = (tmp & (1 << 7)) > 0;
        result.IsPositive = (tmp & (1 << 6)) > 0;
        if (this.#LEN_COT == 2) {
            result.OriginatorAddr = bytes.toUInt();
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
                result.InformationObjects.push(AsduFactory.createInformationObject(tid, bytes));
            }
        }
        else {
            for (let i = 0; i < result.NumberOfObjects; i++) {
                let len = InformationObject[tid].ByteLength;
                bytes = this.#readByteStream(this.#LEN_IO_ADDR);
                result.InformationObjectAddr.push(bytes.toUInt());
                bytes = this.#readByteStream(len);
                // do sth
                result.InformationObjects.push(AsduFactory.createInformationObject(tid, bytes));
            }
        }


        return result;
    }
}


module.exports = Iec104Packet;