require('../bytes-ext')
const BaseTypeQ = class {

    #mask_blocked = 0x10;
    #mask_substituted = 0x20;
    #mask_notTopical = 0x40;
    #mask_invalid = 0x80;

    RawValue = 0;
    ReservedBit = 0;
    Blocked = false;
    Substituted = false;
    NotTopical = false;
    Invalid = false;

    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = BaseTypeQ.extractRawValue(bytes);

            //BaseTypeQ.checkConstructArgs(bytes);

            this.Blocked = Boolean(this.RawValue & this.#mask_blocked);
            this.Substituted = Boolean(this.RawValue & this.#mask_substituted);
            this.NotTopical = Boolean(this.RawValue & this.#mask_notTopical);
            this.Invalid = Boolean(this.RawValue & this.#mask_invalid);
        }

    }

    toByte() {
        return (
            (this.Invalid << 7) | (this.NotTopical << 6) | (this.Substituted << 5) | (this.Blocked << 4) | this.ReservedBit
        );
    }

    toString() {
        return super.toString();
    }

    static checkConstructArgs(value, length = 1) {
        if (!Number.isInteger(value) || value > (1 << (8 * length)) - 1) {
            throw new Error(`非法的参数，参数类型应为${length * 8}位UInt`);
        }
        return true;
    }

    static extractRawValue(bytes) {
        if (Array.isArray(bytes)) {
            return bytes.toUInt();
        }
        else {
            return bytes;
        }
    }

}

const SIQ = class extends BaseTypeQ {
    static ByteLength = 1;
    #mask_value = 0x01;
    #mask_reserved = 0x0E;

    Value = false;
    ReservedBit = 0;


    constructor(bytes) {
        super(bytes);
        BaseTypeQ.checkConstructArgs(this.RawValue, SIQ.ByteLength);
        this.Value = Boolean(bytes & this.#mask_value);
        this.ReservedBit = bytes & this.#mask_reserved;


    }

    toByte() {
        return super.toByte() | this.ReservedBit | this.Value;
    }

    toString() {
        return super.toString();
    }

}

const DIQ = class extends BaseTypeQ {
    static ByteLength = 1;
    #mask_value = 0x03;
    #mask_reserved = 0x0C;

    #Enums = require('./enum');

    Value = this.#Enums.DPI.NotSureOrMidState;
    ReservedBit = 0;


    constructor(bytes) {
        super(bytes);
        BaseTypeQ.checkConstructArgs(this.RawValue, DIQ.ByteLength);
        this.Value = this.RawValue & this.#mask_value;
        this.ReservedBit = this.RawValue & this.#mask_reserved;

    }

    toByte() {

        return super.toByte() | this.ReservedBit | this.Value;
    }

    toString() {
        return super.toString();

    }
}

const QDS = class {
    static ByteLength = 1;
    RawValue = 0;
    Invalid = false;
    NotTopical = false;
    Substituted = false;
    Blocked = false;
    ReservedBit = 0;
    Overflow = false;

    #mask_invalid = 0x80;
    #mask_notTopical = 0x40;
    #mask_substituted = 0x20;
    #mask_blocked = 0x10;
    #mask_reserved = 0x0E;
    #mask_overflow = 0x01;

    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = BaseTypeQ.extractRawValue(bytes);
            BaseTypeQ.checkConstructArgs(this.RawValue, QDS.ByteLength);

            this.Invalid = Boolean(this.RawValue & this.#mask_invalid);
            this.NotTopical = Boolean(this.RawValue & this.#mask_notTopical);
            this.Substituted = Boolean(this.RawValue & this.#mask_substituted);
            this.Blocked = Boolean(this.RawValue & this.#mask_blocked);
            this.ReservedBit = this.RawValue & this.#mask_reserved;
            this.Overflow = Boolean(this.RawValue & this.#mask_overflow);
        }
    }
}

const QDP = class extends BaseTypeQ {
    static ByteLength = 1;

    #mask_reserved = 0x07;
    #mask_effect_invalid = 0x08;


    EffectInvalid = false;
    ReservedBit = 0;


    constructor(bytes) {
        super(bytes);

        BaseTypeQ.checkConstructArgs(this.RawValue, QDP.ByteLength);
        this.EffectInvalid = this.RawValue & this.#mask_effect_invalid;
        this.ReservedBit = this.RawValue & this.#mask_reserved;
    }

    toByte() {
        return super.toByte() | this.ReservedBit | this.EffectInvalid;
    }

    toString() {
        return super.toString();
    }
}

const VTI = class {
    static ByteLength = 1;
    Value = 0;
    Transient = false;
    RawValue = 0;
    #mask_value = 0x6F;
    #mask_transient = 0x80;

    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = BaseTypeQ.extractRawValue(bytes);
            BaseTypeQ.checkConstructArgs(this.RawValue, VTI.ByteLength);
            this.Value = this.RawValue & this.#mask_value;
            this.Transient = this.RawValue & this.#mask_transient;
        }
    }

    toByte() {
        return (this.Transient << 7) | this.Value;
    }

}

const NVA = class {
    static ByteLength = 2;
    Value = 0;

    get RealValue() { return this.Value / this.FullValue; }
    set RealValue(val) {
        this.Value = Math.round(val * this.FullValue);
        if (this.Value > this.FullValue) {
            console.info(`[info] 归一化值越限，当前码值${this.Value}，满码值：${this.FullValue}`);
        }
    }
    FullValue = 32767;
    constructor(bytes, fullValue = 32767) {
        if (bytes != undefined) {
            this.FullValue = fullValue;
            this.Value = bytes.toInt();
            BaseTypeQ.checkConstructArgs(this.Value, NVA.ByteLength);
        }
    }
    toByte() {
        throw new Error("Not Implement.");
    }
}

const SVA = class {
    static ByteLength = 2;
    Value = 0;
    constructor(bytes) {
        if (bytes != undefined) {
            this.Value = bytes.toInt();
            BaseTypeQ.checkConstructArgs(this.Value, SVA.ByteLength);
        }
    }
    toByte() {
        throw new Error("Not Implement.");
    }
}

const R32 = class {

    static ByteLength = 4;

    Value = 0;
    constructor(bytes, littleEndian = true) {
        if (bytes != undefined) {
            let tmp = bytes.toInt();
            BaseTypeQ.checkConstructArgs(tmp, R32.ByteLength);

            let arr = new Uint8Array(bytes);
            let dataView = new DataView(arr.buffer);
            this.Value = dataView.getFloat32(0, littleEndian);

        }
    }
    toByte(littleEndian = true) {
        // 创建一个 4 字节的 ArrayBuffer
        const buffer = new ArrayBuffer(R32.ByteLength);

        // 使用 DataView 来操作 ArrayBuffer
        const dataView = new DataView(buffer);

        // 将浮点数写入到 DataView 中
        dataView.setFloat32(0, this.Value, littleEndian); // 第1个参数是偏移量，false 表示使用大端字节序

        return [...dataView.buffer];
    }
}

module.exports = { SIQ, DIQ, QDS, QDP, VTI, NVA, SVA, R32 }