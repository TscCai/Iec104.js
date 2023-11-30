const Ext = require('./bytes-ext');
const Enums = require('./enum');
const Const = require('./constant');
const Iec104Packet = class {
    RawBytes = [];
    #bytesPointer = 0;

    #APDULength = 0;   // 1B
    get APDULength() { return this.#APDULength; }

    #FrameFormat = "Unknown";    // Depends on Control Field
    get FrameFormat() { return this.#FrameFormat; }

    #ControlField = {};   // 4B
    get ControlField() { return this.#ControlField; }

    constructor(bytes) {
        for (let b of bytes) {
            if (b > 0xFF || b < 0) {
                throw new Error(`${b}不是有效的字节`);
            }
        }
        this.RawBytes = bytes;
        this.#resolve();
    }

    #resolve() {
        let bytes = [];

        // Check the start byte
        bytes = this.#readBytes(Const.LEN_START_BYTE, this.#bytesPointer);
        if (bytes.length < 1 || bytes[0] != Const.START_BYTE) {
            throw new Error(`启动字节不是${Const.START_BYTE}，不是合法的IEC-60870-5-104报文。`);
        }

        // Read & check length of APDU
        bytes = this.#readBytes(Const.LEN_APDU_LENGTH, this.#bytesPointer);
        this.#APDULength = bytes.toUInt();
        if (this.RawBytes.length != this.APDULength + Const.LEN_START_BYTE + Const.LEN_APDU_LENGTH) {
            throw new Error("APDU长度与实际不符。");
        }

        // Read Control fileds
        bytes = this.#readBytes(Const.LEN_CF, this.#bytesPointer);
        this.#readControlField(bytes);

        if (this.FrameFormat == "I-Format") {

        }
    }

    #readBytes(length, offset) {
        let bytes = this.RawBytes.readBytes(length, offset);
        this.#bytesPointer += length;
        return bytes;
    }

    #readControlField(bytes) {
        // Check flag1 and flag2, the 1st and 3rd byte
        let flag1 = bytes[0] & Const.CF_MASK;
        let flag2 = bytes[2] & (Const.CF_MASK >> 1);
        if (flag1 % 2 == 0 && flag2 == 0) {
            // Check flag2, in this case, it's the 3rd byte
            this.#FrameFormat = "I-Format";
            let sendSqNum = bytes.readBytes(2, 0).toUInt() >> 1;
            let receiveSqNum = bytes.readBytes(2, 2).toUInt() >> 1;
            this.#ControlField = { SendSqNum: sendSqNum, ReceiveSqNum: receiveSqNum };
        }
        else if (flag1 == 1 && flag2 == 0 && bytes[0] == 1 && bytes[1] == 0) {
            this.#FrameFormat = "S-Format";
            let receiveSqNum = bytes.readBytes(2, 2).toUInt() >> 1;
            this.#ControlField = { ReceiveSqNum: receiveSqNum };
        }
        else if (flag1 == 3 && bytes[1] * bytes[2] * bytes[3] == 0) {
            this.#FrameFormat = "U-Format";
            switch (bytes[0]) {
                case Enums.UFormatSignalling.STARTDT_Confirm:
                case Enums.UFormatSignalling.STARTDT_Order:
                case Enums.UFormatSignalling.STOPDT_Confirm:
                case Enums.UFormatSignalling.STOPDT_Order:
                case Enums.UFormatSignalling.TESTFR_Confirm:
                case Enums.UFormatSignalling.TESTFR_Order:
                    this.#ControlField = { Sigalling: Enums.UFormatSignalling.toString(bytes[0]) };
                    break;
                default:
                    throw new Error("无效的U格式帧控制域。");
            }
        }
        else {
            throw new Error("未知的帧格式。");
        }
    }
}

module.exports = Iec104Packet;