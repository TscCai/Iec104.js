//require('../bytes-ext')

function checkConstructArgs(value, length = 1) {
    if (!Number.isInteger(value) || value > (1 << (8 * length)) - 1 || value < 0) {
        throw new Error(`非法的参数，参数类型应为${length * 8}位UInt`);
    }
    return true;
}

function extractRawValue(bytes) {
    if (Array.isArray(bytes)) {
        return bytes.toUInt();
    }
    else {
        return bytes;
    }
}

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
            this.RawValue = extractRawValue(bytes);

            //checkConstructArgs(bytes);

            this.Blocked = Boolean(this.RawValue & this.#mask_blocked);
            this.Substituted = Boolean(this.RawValue & this.#mask_substituted);
            this.NotTopical = Boolean(this.RawValue & this.#mask_notTopical);
            this.Invalid = Boolean(this.RawValue & this.#mask_invalid);
        }

    }

    toBytes() {
        return (
            (this.Invalid << 7) | (this.NotTopical << 6) | (this.Substituted << 5) | (this.Blocked << 4) | this.ReservedBit
        );
    }

    toString() {
        return super.toString();
    }

}
// According to IEC 60870-5-101 Chapter 7.2.6
// No.1
const SIQ = class extends BaseTypeQ {
    static ByteLength = 1;
    static Name = 'SIQ';
    #mask_value = 0x01;
    #mask_reserved = 0x0E;

    Value = false;
    ReservedBit = 0;


    constructor(bytes) {
        super(bytes);
        checkConstructArgs(this.RawValue, SIQ.ByteLength);
        this.Value = Boolean(bytes & this.#mask_value);
        this.ReservedBit = bytes & this.#mask_reserved;


    }

    toBytes() {
        return super.toBytes() | this.ReservedBit | this.Value;
    }

    toString() {
        return super.toString();
    }

}

const DIQ = class extends BaseTypeQ {
    static ByteLength = 1;
    static Name = 'DIQ';
    #mask_value = 0x03;
    #mask_reserved = 0x0C;



    Value = { IsOpen: false, IsClosed: false }
    ReservedBit = 0;


    constructor(bytes) {
        super(bytes);
        checkConstructArgs(this.RawValue, DIQ.ByteLength);
        let tmp = this.RawValue & this.#mask_value;
        switch (tmp) {
            case 1: this.Value.IsOpen = true; break;
            case 2: this.Value.IsClosed = true; break;
            case 3:
                this.Value.IsClosed = true;
                this.Value.IsOpen = true;
                break;
        }
        this.ReservedBit = this.RawValue & this.#mask_reserved;

    }

    toBytes() {

        return super.toBytes() | this.ReservedBit | this.Value;
    }

    toString() {
        return super.toString();

    }
}

const QDS = class {
    static ByteLength = 1;
    static Name = "QDS";
    static Description = '';
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
            this.RawValue = extractRawValue(bytes);
            checkConstructArgs(this.RawValue, QDS.ByteLength);

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
    static Name = 'QDP';
    #mask_reserved = 0x07;
    #mask_effect_invalid = 0x08;


    EffectInvalid = false;
    ReservedBit = 0;


    constructor(bytes) {
        super(bytes);

        checkConstructArgs(this.RawValue, QDP.ByteLength);
        this.EffectInvalid = this.RawValue & this.#mask_effect_invalid;
        this.ReservedBit = this.RawValue & this.#mask_reserved;
    }

    toBytes() {
        return super.toBytes() | this.ReservedBit | this.EffectInvalid;
    }

    toString() {
        return super.toString();
    }
}

// No.5
const VTI = class {
    static ByteLength = 1;
    static Name = 'VTI';
    Value = 0;
    Transient = false;
    RawValue = 0;
    #mask_value = 0x6F;
    #mask_transient = 0x80;

    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
            checkConstructArgs(this.RawValue, VTI.ByteLength);
            this.Value = this.RawValue & this.#mask_value;
            this.Transient = this.RawValue & this.#mask_transient;
        }
    }

    toBytes() {
        return (this.Transient << 7) | this.Value;
    }

}

const NVA = class {
    static ByteLength = 2;
    static Name = 'NVA';
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
            checkConstructArgs(this.Value, NVA.ByteLength);
        }
    }
    toBytes() {
        throw new Error("Not Implement.");
    }
}

const SVA = class {
    static Name = "SVA";
    static Description = '';
    static ByteLength = 2;
    Value = 0;
    constructor(bytes) {
        if (bytes != undefined) {
            this.Value = bytes.toInt();
            checkConstructArgs(this.Value, SVA.ByteLength);
        }
    }
    toBytes() {
        throw new Error("Not Implement.");
    }
}

const R32 = class {
    static Name = 'R32';
    static ByteLength = 4;

    Value = 0;
    constructor(bytes, littleEndian = true) {
        if (bytes != undefined) {
            let tmp = bytes.toInt();
            checkConstructArgs(tmp, R32.ByteLength);

            // let arr = new Uint8Array(bytes);
            // let dataView = new DataView(arr.buffer);
            // this.Value = dataView.getFloat32(0, littleEndian);
            this.Value = bytes.toFloat();

        }
    }
    toBytes(littleEndian = true) {
        // 创建一个 4 字节的 ArrayBuffer
        const buffer = new ArrayBuffer(R32.ByteLength);

        // 使用 DataView 来操作 ArrayBuffer
        const dataView = new DataView(buffer);

        // 将浮点数写入到 DataView 中
        dataView.setFloat32(0, this.Value, littleEndian); // 第1个参数是偏移量，false 表示使用大端字节序

        return [...dataView.buffer];
    }
}

const BCR = class {
    static ByteLength = 5;
    static Name = 'BCR';
    Value = {};

    #mask_sequence = 0xF8;
    #mask_isOverflow = 0x04;
    #mask_isAdjust = 0x02;
    #mask_isInvalid = 0x01;

    constructor(bytes) {
        if (bytes != undefined) {
            let tmp = bytes.toInt();
            checkConstructArgs(tmp, BCR.ByteLength);
            let count = bytes.readBytes(4, 0).toInt();
            let sequenceFlag = bytes.readBytes(5, 4).toUInt();
            let sqNum = sequenceFlag & this.#mask_sequence;
            let isOverflow = Boolean(sequenceFlag & this.#mask_isOverflow);
            let isInvalid = Boolean(sequenceFlag & this.#mask_isInvalid);
            let isAdjust = Boolean(sequenceFlag & this.#mask_isAdjust);
            this.Value = { Count: count, SequenceNumber: sqNum, IsOverflow: isOverflow, IsAdjust: isAdjust, IsInvalid: isInvalid };
        }
    }
    toBytes() {
        throw new Error("Not Implement.");
    }
}

// No.10
const SEP = class extends BaseTypeQ {
    static Name = 'SEP';
    static ByteLength = 1;
    #mask_value = 0x03;
    #mask_reserved = 0x04;
    #mask_effect_invalid = 0x10;
    EffectInvalid = false;
    Value = 0;
    ReservedBit = 0;


    constructor(bytes) {
        super(bytes);
        checkConstructArgs(this.RawValue, SEP.ByteLength);
        this.Value = this.RawValue & this.#mask_value;
        this.ReservedBit = this.RawValue & this.#mask_reserved;
        this.EffectInvalid = this.RawValue & this.#mask_effect_invalid;

    }

    toBytes() {

        return super.toBytes() | this.ReservedBit | this.Value;
    }

    toString() {
        return super.toString();

    }

}

const SPE = class {
    static ByteLength = 1;
    static Name = 'SPE';
    GeneralStart = false;
    PhaseAStart = false;
    PhaseBStart = false;
    PhaseCStart = false;
    ShortcutCurrentStart = false;
    BackwardProtectionStart = false;
    ReservedBit = 0;

    #mask_GS = 0x01;
    #mask_SL1 = 0x02;
    #mask_SL2 = 0x04;
    #mask_SL3 = 0x08;
    #mask_SIE = 0x10;
    #mask_SRD = 0x20;
    #mask_reserved = 0xC0;

    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
            checkConstructArgs(this.RawValue, SPE.ByteLength);
            this.GeneralStart = Boolean(this.RawValue & this.#mask_GS);
            this.PhaseAStart = Boolean(this.RawValue & this.#mask_SL1);
            this.PhaseBStart = Boolean(this.RawValue & this.#mask_SL2);
            this.PhaseCStart = Boolean(this.RawValue & this.#mask_SL3);
            this.ShortcutCurrentStart = Boolean(this.RawValue & this.#mask_SIE);
            this.BackwardProtectionStart = Boolean(this.RawValue & this.#mask_SRD)
            this.ReservedBit = this.RawValue & this.#mask_reserved;
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
}

const OCI = class {
    static ByteLength = 1;
    static Name = 'OCI';
    GeneralOut = false;
    PhaseAOut = false;
    PhaseBOut = false;
    PhaseCOut = false;
    ReservedBit = 0;
    #mask_GC = 0x01;
    #mask_CL1 = 0x02;
    #mask_CL2 = 0x04;
    #mask_CL3 = 0x08;
    #mask_reserved = 0xF0;

    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
            checkConstructArgs(this.RawValue, SPE.ByteLength);
            this.GeneralOut = Boolean(this.RawValue & this.#mask_GC);
            this.PhaseAOut = Boolean(this.RawValue & this.#mask_CL1);
            this.PhaseBOut = Boolean(this.RawValue & this.#mask_CL2);
            this.PhaseCOut = Boolean(this.RawValue & this.#mask_CL3);
            this.ReservedBit = this.RawValue & this.#mask_reserved;
        }
    }

    toBytes() {
        throw new Error("Not implement");
    }
}

const BSI = class {
    static ByteLength = 4;
    static Name = 'BSI';
    RawValue = 0;
    Value = "";
    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
            checkConstructArgs(this.RawValue, BSI.ByteLength);
            this.Value = this.RawValue.toString(2);
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
}

const FBP = class {
    static ByteLength = 2;
    static Name = 'FBP';
    RawValue = 0x55AA;
    Value = 0x55AA;
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes) && bytes.length == 2 && bytes[0] == 0xAA && bytes[1] == 0x55) {
                return;
            }
            if (bytes == 0x55AA) {
                return;
            }
            throw new Error(`非法的测试字${bytes}`);
        }
    }
    toBytes() {
        return [0xAA, 0x55]
    }
}

//No.15
const SCO = class {
    static ByteLength = 1;
    static Name = 'SCO';
    RawValue = 0;
    ToClose = false;
    ToOpen = !this.ToClose;

    #mask_cmd = 0x01;
    #cmd = "";

    ReservedBit = 0;
    #mask_reserved = 0x02;
    #mask_qoc = 0xFC;

    QOC = {}
    constructor(bytes) {
        this.RawValue = extractRawValue(bytes);
        checkConstructArgs(this.RawValue, SCO.ByteLength);
        this.ToClose = Boolean(this.RawValue & this.#mask_cmd);
        this.ToOpen = !this.ToClose;
        this.#cmd = this.ToClose ? "To Close" : "To Open";
        this.ReservedBit = this.RawValue & this.#mask_reserved;
        this.QOC = new QOC(this.RawValue & this.#mask_qoc);
    }
    toBytes() {
        throw new Error("Not implement.");
    }
    toString() {
        return `{Command: ${this.#cmd}, ReservedBit:${this.ReservedBit},${this.QOC.toString()}`;
    }
}

const DCO = class {
    static ByteLength = 1;
    static Name = 'DCO';
    RawValue = 0;
    #mask_cmd = 0x03;
    ToClose = false;
    ToOpen = false;
    NotAllowed = false;

    #mask_qoc = 0xFC;
    #cmd = "";
    QOC = {}
    constructor(bytes) {
        this.RawValue = extractRawValue(bytes);
        checkConstructArgs(this.RawValue, DCO.ByteLength);
        let tmp = this.RawValue & this.#mask_cmd;
        switch (tmp) {
            case 0:
            case 3:
                this.NotAllowed = true;
                this.#cmd = "Not Allowed.";
                break;
            case 1:
                this.ToOpen = true;
                this.#cmd = "To Open.";
                break;
            case 2:
                this.ToClose = true;
                this.#cmd = "To Close.";
                break;
        }
        this.QOC = new QOC(this.RawValue & this.#mask_qoc);
    }
    toBytes() {
        throw new Error("Not implement.");
    }
    toString() {
        return `{Command: ${this.#cmd},${this.QOC.toString()}`;
    }
}
const RCO = class {
    static ByteLength = 1;
    static Name = 'RCO';
    RawValue = 0;
    #mask_cmd = 0x03;
    UpShift = false;
    DownShift = false;
    NotAllowed = false;

    #mask_qoc = 0xFC;
    #cmd = "";
    QOC = {}
    constructor(bytes) {
        this.RawValue = extractRawValue(bytes);
        checkConstructArgs(this.RawValue, RCO.ByteLength);
        let tmp = this.RawValue & this.#mask_cmd;
        switch (tmp) {
            case 0:
            case 3:
                this.NotAllowed = true;
                this.#cmd = "Not Allowed.";
                break;
            case 1:
                this.DownShift = true;
                this.#cmd = "Down Shift.";
                break;
            case 2:
                this.UpShift = true;
                this.#cmd = "Up Shift.";
                break;
        }
        this.QOC = new QOC(this.RawValue & this.#mask_qoc);
    }
    toBytes() {
        throw new Error("Not implement.");
    }
    toString() {
        return `{Command: ${this.#cmd},${this.QOC.toString()}`;
    }
}
const CP16Time2a = class {
    static ByteLength = 2;
    static Name = 'CP16Time2a';
    Millisecond = 0;
    constructor(bytes) {
        if (bytes != undefined) {
            let offset = 0;
            let tmp = bytes.readBytes(2, offset);
            offset += 2;
            this.Millisecond = tmp.toUInt();
        }

    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {

    }


}

const CP24Time2a = class extends CP16Time2a {
    static ByteLength = 3;
    static Name = 'CP24Time2a';
    Minute = 0;
    #mask_minute = 0x3F;

    IsInvalid = false;
    #mask_invalid = 0x80;

    Reserved1 = 0;
    #mask_res1 = 0x40;

    TimeType = "";

    constructor(bytes) {
        super(bytes);
        if (bytes != undefined) {
            let offset = 2;
            super(bytes.readBytes(offset, 0));

            let tmp = bytes.readBytes(2, offset);
            offset += 2;
            this.Millisecond = tmp.toUInt();

            tmp = bytes.readBytes(1, offset);
            offset += 1;
            this.IsInvalid = Boolean(tmp[0] & this.#mask_invalid);
            this.Reserved1 = tmp[0] & this.#mask_res1;
            this.TimeType = Boolean(this.Reserved1) ? "Substituted Time" : "Real Time";
            this.Minute = tmp[0] & this.#mask_minute;
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {

    }


}

const CP56Time2a = class extends CP24Time2a {
    static ByteLength = 7;
    static Name = 'CP56Time2a';

    Hour = 0;
    #mask_hour = 0x1F;

    DayOfMonth = 0;
    #mask_dom = 0x1F;

    DayOfWeek = 0;
    #mask_dow = 0xE0;

    Month = 0;
    #mask_month = 0x0F;

    Year = 0;
    #mask_year = 0x7F;


    IsSummerTime = false;
    #mask_su = 0x80;

    Reserved2 = 0;
    #mask_res2 = 0x60;
    Reserved3 = 0;
    #mask_res3 = 0xF0;
    Reserved4 = 0;
    #mask_res4 = 0x80;

    constructor(bytes) {
        super(bytes);
        if (bytes != undefined) {
            let offset = 3;
            super(bytes.readBytes(offset, 0));

            let tmp = bytes.readBytes(1, offset);
            offset += 1;
            this.IsSummerTime = Boolean(tmp[0] & this.#mask_su);
            this.Reserved2 = tmp[0] & this.#mask_res2;
            this.Hour = tmp[0] & this.#mask_hour;
            this.DayOfWeek = (tmp[0] & this.#mask_dow) >> 5;
            this.DayOfMonth = tmp[0] & this.#mask_dom;

            tmp = bytes.readBytes(1, offset);
            offset += 1;
            this.Reserved3 = tmp[0] & this.#mask_res3;
            this.Month = tmp[0] & this.#mask_month;

            tmp = bytes.readBytes(1, offset);
            offset += 1;
            this.Reserved4 = tmp[0] & this.#mask_res4;
            this.Year = tmp[0] & this.#mask_year;
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {

    }


}
// No.20

const COI = class {
    static ByteLength = 1;
    static Name = 'COI';
    #mask_val = 0xFE;
    #mask_init = 0x01;
    InitReason = "";
    IsInitParamChanged = "";
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            let reason = (bytes & this.#mask_val) >> 1;
            switch (reason) {
                case 0: this.InitReason = "Local Power On"; break;
                case 1: this.InitReason = "Local Manual Reset"; break;
                case 2: this.InitReason = "Remote Reset"; break;
                case (reason >= 3 && reason <= 31): this.InitReason = "Reserved for this standard"; break;
                case (reason >= 32 && reason <= 127): this.InitReason = "Reserved for special"; break;
            }
            this.IsInitParamChanged = Boolean(bytes & this.#mask_init);

        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
}

const QOI = class {
    static ByteLength = 1;
    static Name = 'QOI';
    Interrogation = "";
    #group_offset = -20;
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.Interrogation = bytes + this.#group_offset;
        }
    }
    toString() {
        return `Interrogate Group ${this.Interrogation}`;
    }
    toBytes() {
        throw new Error("Not implement");
    }

}

const QCC = class {
    static ByteLength = 1;
    static Name = 'QCC';
    #mask_req = 0xFC;
    #mask_freeze = 0x03;
    Request = 0;
    Freeze = 0;
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.Freeze = bytes & this.#mask_freeze;
            this.Request = (bytes & this.#mask_req) >> 2;
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {
        let result = "", req = "", freeze = "";
        switch (this.Request) {
            case 0: req = "No Request"; break;
            case 1:
            case 2:
            case 3:
            case 4:
                req = `Request Counter Group: ${this.Request}`; break;
            case 5:
                req = "General Request Counter"; break;
            case (this.Request >= 0 || this.Request <= 31):
                req = "Reserved for compatibility"; break;
            case (this.Request >= 32 || this.Request <= 63):
                req = "Reserved for special"; break;
        }
        switch (this.Freeze) {
            case 0: freeze = "Read(no freeze or reset)"; break;
            case 1: freeze = "Freeze Without Reset"; break;
            case 2: freeze = "Freeze With Reset"; break;
            case 3: freeze = "Reset"; break;
        }
        result = `{Request: "${req}", Freeze:"${freeze}"}`
        return result;
    }
}

const QPM = class {
    static ByteLength = 1;
    static Name = 'QPM';
    #mask_kpa = 0x3F;
    #mask_lpc = 0x40;
    #mask_pop = 0x80;
    KindOfParam = "";
    LocalParamChanged = false;
    ParamOperate = false;
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.KindOfParam = bytes & this.#mask_kpa;
            this.LocalParamChanged = Boolean(bytes & this.#mask_lpc);
            this.ParamOperate = Boolean(bytes & this.#mask_pop);
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {
        let result = "", kpa = "";
        switch (this.KindOfParam) {
            case 0: kpa = "Not used"; break;
            case 1: kpa = "Threshold value"; break;
            case 2: kpa = "Smoothing factor"; break;
            case 3: kpa = "Min measured value"; break;
            case 4: kpa = "Max measured value"; break;
            case (this.KindOfParam >= 5 && this.KindOfParam <= 31):
                kpa = "Reserved for compatibility"; break;
            case (this.Request >= 32 || this.Request <= 63):
                kpa = "Reserved for special"; break;
        }
        result = `{KindOfParam: "${kpa}", LocalParamChanged: "${this.LocalParamChanged}, ParamOperate: ${this.ParamOperate}"}`
        return result;
    }
}

// No.25
const QPA = class {
    static ByteLength = 1;
    static Name = 'QPA';
    Value = 0;
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.Value = bytes;
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {
        let act = "";
        switch (this.Value) {
            case 0: act = "Not used"; break;
            case 1: act = "Active/Inactive param loaded before"; break;
            case 2: act = "Active/Inactive param of addressing information object"; break;
            case 3: act = "Active/Inactive param of cycling information object"; break;
            case (this.KindOfParam >= 4 && this.KindOfParam <= 127):
                kpa = "Reserved for compatibility"; break;
            case (this.Request >= 128 || this.Request <= 255):
                kpa = "Reserved for special"; break;
        }
        result = `{Active: "${act}"}`
        return result;
    }
}
const QOC = class {
    static Name = 'QOC';
    #mask_s_or_e = 0x80;
    #mask_qu = 0x7C;

    RawValue = 0;
    IsSelect = false;
    IsExecute = false;
    QU = 0;
    QUString = "";
    #cmd = "";
    Value = this.toString();

    constructor(uint) {
        if (uint != undefined) {
            this.RawValue = uint;
            this.IsSelected = Boolean(this.RawValue & this.#mask_s_or_e);
            this.IsExecute = !this.IsSelect;
            this.#cmd = this.IsSelect ? "Select" : "Execute";
            this.QU = (this.RawValue & this.#mask_qu) >> 1;
            switch (this.QU) {
                case 0: this.QUString = "No more define."; break;
                case 1: this.QUString = "Short pulse remain time."; break;
                case 2: this.QUString = "Long pulse remain time."; break;
                case 3: this.QUString = "Continuous output."; break;
                case this.QU >= 4 || this.QU <= 8: this.QUString = "Reserved for this standard."; break;
                case this.QU >= 9 || this.QU <= 15: this.QUString = "Reserved for other standard."; break;
                case this.QU >= 16 || this.QU <= 31: this.QUString = "Reserved for special."; break;

            }
        }

    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {
        let result = `{Select Or Execute: ${this.#cmd}, QU: ${this.QUString}}`;
        return result;
    }


}
const GRP = class {
    static Name = 'GRP';
    static ByteLength = 1;
    Value = 0;
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.Value = bytes;
        }
    }
    toBytes() {
        throw new Error("Not implement");
    }
    toString() {
        let reset = "";
        switch (this.Value) {
            case 0: reset = "Not used"; break;
            case 1: reset = "General reset"; break;
            case 2: reset = "Information with timestamp to be handled in reset buffer"; break;
            case (this.Value >= 3 && this.Value <= 127):
                reset = "Reserved for compatibility"; break;
            case (this.Request >= 128 || this.Request <= 255):
                reset = "Reserved for special"; break;
        }
        result = `{Reset process: "${reset}"}`
        return result;
    }
}
const FRQ = class {
    static Name = 'FRQ';
    static ByteLength = 1;
    #mask_ready = 0x80;
    #mask_reserved = 0x7F;
    RawValue = 0;
    #reservedBit = 0;
    Value = '';
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.RawValue = bytes;
            const flag = Boolean(this.RawValue & this.#mask_ready);
            if (flag) {
                this.Value = 'Positive acknowledge of select, request or stop'
            }
            else {
                this.Value = 'Negative acknowledge of select, request or stop'
            }
            this.#reservedBit = this.RawValue & this.#mask_reserved;
        }
    }
    toBytes() {
        throw new Error('Not implement');
    }
    toString() {
        let appendix = '';
        if (this.#reservedBit > 0) {
            appendix = `, Reserved Bit: ${this.#reservedBit}`;
        }
        return `{Value:${this.Value}${appendix}}`
    }
}
const SRQ = class {
    static Name = 'SRQ';
    static ByteLength = 1;
    #mask_ready = 0x80;
    #mask_reserved = 0x7F;
    RawValue = 0;
    #reservedBit = 0;
    Value = '';
    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.RawValue = bytes;
            const flag = Boolean(this.RawValue & this.#mask_ready);
            if (flag) {
                this.Value = 'Section ready'
            }
            else {
                this.Value = 'Section not ready'
            }
            this.#reservedBit = this.RawValue & this.#mask_reserved;
        }
    }
    toBytes() {
        throw new Error('Not implement');
    }
    toString() {
        let appendix = '';
        if (this.#reservedBit > 0) {
            appendix = `, Reserved Bit: ${this.#reservedBit}`;
        }
        return `{Value:${this.Value}${appendix}}`
    }
}

// No.30
const SCQ = class {
    static Name = 'SCQ';
    static ByteLength = 1;
    #mask_select = 0x0F;

    RawValue = 0;
    Value = '';

    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.RawValue = bytes;

            const low = this.RawValue & this.#mask_select;
            const high = this.RawValue >> 4;
            switch (low) {
                case 0: this.Value = 'Default operation'; break;
                case 1: this.Value = 'Select file'; break;
                case 2: this.Value = 'Request file'; break;
                case 3: this.Value = 'Stop active file'; break;
                case 4: this.Value = 'Delete file'; break;
                case 5: this.Value = 'Select section'; break;
                case 6: this.Value = 'Request section'; break;
                case 7: this.Value = 'Stop active section'; break;
                case low >= 8 && low <= 15: this.Value = 'Reserved'; break;
            }
            this.Value += ';';
            switch (high) {
                case 0: this.Value += 'Default'; break;
                case 1: this.Value += 'No request space'; break;
                case 2: this.Value += 'CRC error'; break;
                case 3: this.Value += 'Non-supposed communication service'; break;
                case 4: this.Value += 'Non-supposed file name'; break;
                case 5: this.Value += 'Non-supposed section name'; break;
                case 11:
                case 12:
                case 13:
                case 14:
                case 15: this.Value += 'Reserved'; break;
            }
        }
    }
    toBytes() {
        throw new Error('');
    }
    toString() {
        return `{SelectAndCall:${this.Value}}`;
    }
}
const LSQ = class {
    static Name = 'LSQ';
    static ByteLength = 1;
    RawValue = 0;
    Value = '';

    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.RawValue = bytes;

            switch (this.RawValue) {
                case 0: this.Value = 'Not used'; break;
                case 1: this.Value = 'File transmission without stop active'; break;
                case 2: this.Value = 'File transmission with stop active'; break;
                case 3: this.Value = 'Section transmission without stop active'; break;
                case 4: this.Value = 'Section transmission with stop active'; break;
                case this.RawValue >= 5 && this.RawValue <= 255:
                    this.Value = 'Reserved'; break;
            }
        }
    }
    toBytes() {
        throw new Error('');
    }
    toString() {
        return `{LastSection:${this.Value}}`;
    }
}
const AFQ = class {
    static Name = 'AFQ';
    static ByteLength = 1;
    #mask_low = 0x0F;

    RawValue = 0;
    Value = '';

    constructor(bytes) {
        if (bytes != undefined) {
            if (Array.isArray(bytes)) {
                bytes = bytes[0];
            }
            checkConstructArgs(bytes);
            this.RawValue = bytes;

            const low = this.RawValue & this.#mask_low;
            const high = this.RawValue >> 4;
            switch (low) {
                case 0: this.Value = 'Default'; break;
                case 1: this.Value = 'Positive ack of file transmission'; break;
                case 2: this.Value = 'Negative ack of file transmission'; break;
                case 3: this.Value = 'Positive ack of section transmission'; break;
                case 4: this.Value = 'Negative ack of section transmission'; break;
                case low >= 5 && low <= 15: this.Value = 'Reserved'; break;
            }
            this.Value += ';';
            switch (high) {
                case 0: this.Value += 'Default'; break;
                case 1: this.Value += 'No request space'; break;
                case 2: this.Value += 'CRC error'; break;
                case 3: this.Value += 'Non-supposed communication service'; break;
                case 4: this.Value += 'Non-supposed file name'; break;
                case 5: this.Value += 'Non-supposed section name'; break;
                case 11:
                case 12:
                case 13:
                case 14:
                case 15: this.Value += 'Reserved'; break;
            }
        }
    }
    toBytes() {
        throw new Error('');
    }
    toString() {
        return `{FileOrSectionAck:${this.Value}}`;
    }
}
const NOF = class {
    static Name = 'NOF';
    ByteLength = 2;
    RawValue = 0;
    Value = '';
    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
        }
        if (this.RawValue > 0) {
            this.Value = this.RawValue;
        }

    }
    toString() {
        return `{File name:${this.Value}}`;
    }
}
const NOS = class {
    static Name = 'NOS';
    static ByteLength = 1;
    RawValue = 0;
    Value = '';
    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
        }
        if (this.RawValue > 0) {
            this.Value = this.RawValue;
        }
    }
    toString() {
        return `{Section name:${this.Value}}`;
    }
}

// No.35
const LOF = class {
    static Name = 'LOF';
    static ByteLength = 3;
    RawValue = 0;
    Value = '';
    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
        }
        if (this.RawValue > 0) {
            this.Value = this.RawValue;
        }

    }
    toString() {
        return `{Length of file:${this.Value}}`;
    }
}
const LOS = class {
    static Name = 'LOS';
    static ByteLength = 1;
    RawValue = 0;
    Value = 0;
    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
        }
        if (this.RawValue > 0) {
            this.Value = this.RawValue;
        }

    }
    toString() {
        return `{Length of section:${this.Value}}`;
    }
}
const COS = class {
    static Name = 'COS';
    ByteLength = -1;
    RawValue = [];
    Value = [];
    constructor(bytes, length) {
        if (bytes != undefined && Array.isArray(bytes)) {
            this.RawValue = bytes;
            this.Value = bytes;
            this.ByteLength = bytes.length;
        }
        if (length != undefined && length > 0) {
            this.RawValue = new Array(length);
            this.Value = this.RawValue;
        }


    }
}
const CHS = class {
    static Name = 'CHS';
    static ByteLength = 1;
    RawValue = 0;
    Value = '';
    constructor(bytes) {
        if (bytes != undefined) {
            this.RawValue = extractRawValue(bytes);
        }
        if (this.RawValue > 0) {
            this.Value = this.RawValue;
        }

    }
    toString() {
        return `{CRC:${this.Value}}`;
    }
}
const SOF = class {
    static Name = 'SOF';
    static ByteLength = 1;
    constructor(bytes) {
        throw new Error('not implement');
    }
}
const QOS = class {
    static Name = 'QOS';
    static ByteLength = 1;
    constructor(bytes) {
        throw new Error('not implement');
    }
}
const SCD = class {
    static Name = 'SCD';
    static ByteLength = 1;
    constructor(bytes) {
        throw new Error('not implement');
    }
}

module.exports = {
    SIQ, DIQ, QDS, QDP, VTI, NVA, SVA, R32, BCR, SEP,
    SPE, OCI, BSI, FBP, SCO, DCO, RCO, CP56Time2a, CP24Time2a, CP16Time2a,
    COI, QOI, QCC, QPM, QPA, QOC, GRP, FRQ, SRQ, SCQ,
    LSQ, AFQ, NOF, NOS, LOF, LOS, CHS, SOF, QOS, SCD
}