const BaseType = require('./information-element');
//require('../bytes-ext')
const BaseInformationObject = class {
    static TID = 0x00;
    static Description = 'Abstract information object';
    static ByteLength = 0;
    Value = {};
    #stream = { ptr: 0, bytes: [] };
    constructor(bytes) {
        this.#stream.bytes = bytes;
    }
    readStream(length) {
        if (this.#stream.ptr + length > this.#stream.bytes.length) {
            throw new Error('Out of stream');
        }
        const result = this.#stream.bytes.readBytes(length, this.#stream.ptr);
        this.#stream.ptr += length;
        return result;
    }
    isEndOfStream() {
        return this.#stream.ptr >= this.#stream.bytes.length;
    }
    resetStream() {
        this.#stream.ptr = 0;
    }
}

// According to IEC-60870-5-101 Chapter 7.3.1
const M_SP_NA_1 = class extends BaseInformationObject {
    static TID = 0x01;
    static Description = 'Single-point information';
    static ByteLength = BaseType.SIQ.ByteLength;
    constructor(bytes) {
        super(bytes);
        this.Value = { SIQ: new BaseType.SIQ(bytes) };
    }
}

const M_SP_TA_1 = class extends BaseInformationObject {
    static TID = 0x02;
    static Description = 'Single-point information with time tag'
    static ByteLength = BaseType.SIQ.ByteLength + BaseType.CP24Time2a.ByteLength;
    constructor(bytes) {
        super(bytes);
        const value = new BaseType.SIQ(this.readStream(BaseType.SIQ.ByteLength));
        const timestamp = new BaseType.CP24Time2a(this.readStream(BaseType.CP24Time2a.ByteLength));
        this.Value = { SIQ: value, Timestamp: timestamp }
    }
}

const M_DP_NA_1 = class extends BaseInformationObject {
    static TID = 0x03;
    static Description = 'Double-point information'
    static ByteLength = BaseType.DIQ.ByteLength;
    constructor(bytes) {
        super(bytes);
        this.Value = { DIQ: new BaseType.DIQ(bytes) };
    }
}

const M_DP_TA_1 = class extends BaseInformationObject {
    static TID = 0x04;
    static Description = "Double-point information with time tag";
    static ByteLength = BaseType.DIQ.ByteLength + BaseType.CP24Time2a.ByteLength;
    constructor(bytes) {
        if (bytes.length != M_DP_TA_1.ByteLength) {
            throw new Error('Invalid length of input bytes');
        }
        super(bytes);
        const value = new BaseType.DIQ(this.readStream(BaseType.DIQ.ByteLength));
        const timestamp = new BaseType.DIQ(this.readStream(BaseType.CP24Time2a.ByteLength));
        this.Value = { DIQ: value, Timestamp: timestamp };
    }
}
const M_ST_NA_1 = class extends BaseInformationObject {
    static TID = 0x05;
    static Description = "Step position information";
    static ByteLength = BaseType.VTI.ByteLength + BaseType.QDS.ByteLength;
    constructor(bytes) {
        super(bytes);
        const value = new BaseType.VTI(this.readStream(BaseType.VTI.ByteLength));
        const quality = new BaseType.QDS(this.readStream(BaseType.QDS.ByteLength));
        this.Value = { VTI: value, Quality: quality };
    }
}
const M_ST_TA_1 = class extends BaseInformationObject {
    static TID = 0x06;
    static Description = "Step position information with time tag";
    static ByteLength = BaseType.VTI.ByteLength + BaseType.QDS.ByteLength + BaseType.CP24Time2a.ByteLength;
    constructor(bytes) {
        const value = new BaseType.VTI(bytes.readStream(BaseType.VTI.ByteLength));
        const quality = new BaseType.QDS(bytes.readStream(BaseType.QDS.ByteLength));

    }
}
const M_BO_NA_1 = class extends BaseInformationObject {
    static TID = 0x07;
    static Description = "Bitstring of 32 bit";
    static ByteLength = 4 + BaseType.QDS.ByteLength;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_BO_TA_1 = class extends BaseInformationObject {
    static TID = 0x08;
    static Description = "Bitstring of 32 bit with time tag";
    static ByteLength = 4 + BaseType.QDS.ByteLength + 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_NA_1 = class extends BaseInformationObject {
    static TID = 0x09;
    static Description = "Measured value, normalised value";
    static ByteLength = BaseType.NVA.ByteLength + BaseType.QDS.ByteLength;
    constructor(bytes) {
        this.Value = { NVA: new BaseType.NVA(bytes).Value, Quality: new BaseType.QDS(bytes) }
        console.log("not implement");
    }
}
const M_ME_TA_1 = class extends BaseInformationObject {
    static TID = 0x0A;
    static Description = "Measured value, normalized value with time tag";
    static ByteLength = M_ME_NA_1.ByteLength + 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_NB_1 = class {
    static TID = 0x0B;
    static Description = "Measured value, scaled value";
    static ByteLength = BaseType.SVA.ByteLength + BaseType.QDS.ByteLength;
    constructor(bytes) {
        //super(bytes);
        this.Value = { Value: new BaseType.SVA(bytes.readBytes(2, 0)).Value, Quality: new BaseType.QDS(bytes.readBytes(1, 2)) };
    }
}
const M_ME_TB_1 = class extends BaseInformationObject {
    static TID = 0x0C;
    static Description = "Measured value, scaled value wit time tag";
    static ByteLength = M_ME_NB_1.ByteLength + 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_NC_1 = class extends BaseInformationObject {
    static TID = 0x0D;
    static Description = "Measured value, short floating point number";
    static ByteLength = BaseType.R32.ByteLength + BaseType.QDS.ByteLength;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_TC_1 = class extends BaseInformationObject {
    static TID = 0x0E;
    static Description = "Measured value, short floating point number with time tag";
    static ByteLength = M_ME_NC_1.ByteLength + 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_IT_NA_1 = class extends BaseInformationObject {
    static TID = 0x0F;
    static Description = "Integrated totals";
    static ByteLength = 5;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_IT_TA_1 = class extends BaseInformationObject {
    static TID = 0x10;
    static Description = "Integrated totals with time tag";
    static ByteLength = M_IT_NA_1.ByteLength + 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_EP_TA_1 = class extends BaseInformationObject {
    static TID = 0x11;
    static Description = "Event of protection equipment with time tag";
    static ByteLength = 6;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_EP_TB_1 = class extends BaseInformationObject {
    static TID = 0x12;
    static Description = "Packed start events of protection equipment with time tag";
    static ByteLength = 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_EP_TC_1 = class extends BaseInformationObject {
    static TID = 0x13;
    static Description = "Packed output circuit information of protection equipment with time tag";
    static ByteLength = 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_PS_NA_1 = class extends BaseInformationObject {
    static TID = 0x14;
    static Description = "Packed single point information with status change detection";
    static ByteLength = 4;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_ND_1 = class extends BaseInformationObject {
    static TID = 0x15;
    static Description = "Measured value, normalized value without quality descriptor";
    static ByteLength = BaseType.NVA.ByteLength;
    constructor(bytes) {
        this.Value = new BaseType.NVA(bytes);
    }
}
const M_SP_TB_1 = class extends BaseInformationObject {
    static TID = 0x1E;
    static Description = "Single-point information with time tag CP56Time2a";
    static ByteLength = BaseType.SIQ.ByteLength + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_DP_TB_1 = class extends BaseInformationObject {
    static TID = 0x1F;
    static Description = "Double-point information with time tag CP56Time2a";
    static ByteLength = BaseType.DIQ.ByteLength + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ST_TB_1 = class extends BaseInformationObject {
    static TID = 0x20;
    static Description = "Step position information with time tag CP56Time2a";
    static ByteLength = BaseType.VTI.ByteLength + BaseType.QDS.ByteLength + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_BO_TB_1 = class extends BaseInformationObject {
    static TID = 0x21;
    static Description = "Bitstring of 32 bit with time tag CP56Time2a";
    static ByteLength = 4 + BaseType.QDS.ByteLength + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_TD_1 = class extends BaseInformationObject {
    static TID = 0x22;
    static Description = "Measured value, normalised value with time tag CP56Time2a";
    static ByteLength = BaseType.NVA.ByteLength + BaseType.QDS.ByteLength + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_TE_1 = class extends BaseInformationObject {
    static TID = 0x23;
    static Description = "Measured value, scaled value with time tag CP56Time2a";
    static ByteLength = BaseType.SVA.ByteLength + BaseType.QDS.ByteLength + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_ME_TF_1 = class extends BaseInformationObject {
    static TID = 0x24;
    static Description = "Measured value, short floating point number with time tag CP56Time2a";
    static ByteLength = BaseType.R32.ByteLength + BaseType.QDS.ByteLength + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_IT_TB_1 = class extends BaseInformationObject {
    static TID = 0x25;
    static Description = "Integrated totals with time tag CP56Time2a";
    static ByteLength = 5 + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_EP_TD_1 = class extends BaseInformationObject {
    static TID = 0x26;
    static Description = "Event of protection equipment with time tag CP56Time2a";
    static ByteLength = 1 + 2 + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_EP_TE_1 = class extends BaseInformationObject {
    static TID = 0x27;
    static Description = "Packed start events of protection equipment with time tag CP56Time2a";
    static ByteLength = 1 + BaseType.QDP.ByteLength + 2 + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const M_EP_TF_1 = class extends BaseInformationObject {
    static TID = 0x28;
    static Description = "Packed output circuit information of protection equipment with time tag CP56Time2a";
    static ByteLength = 1 + BaseType.QDP.ByteLength + 2 + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_SC_NA_1 = class extends BaseInformationObject {
    static TID = 0x2D;
    static Description = "Single command";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_DC_NA_1 = class extends BaseInformationObject {
    static TID = 0x2E;
    static Description = "Double command";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_RC_NA_1 = class extends BaseInformationObject {
    static TID = 0x2F;
    static Description = "Regulating step command";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_SE_NA_1 = class extends BaseInformationObject {
    static TID = 0x30;
    static Description = "Set-point Command, normalized value";
    static ByteLength = BaseType.NVA.ByteLength + 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_SE_NB_1 = class extends BaseInformationObject {
    static TID = 0x31;
    static Description = "Set-point Command, scaled value";
    static ByteLength = BaseType.SVA.ByteLength + 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_SE_NC_1 = class extends BaseInformationObject {
    static TID = 0x32;
    static Description = "Set-point Command, short floating point number";
    static ByteLength = BaseType.R32.ByteLength + 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_BO_NA_1 = class extends BaseInformationObject {
    static TID = 0x33;
    static Description = "Bitstring 32 bit command";
    static ByteLength = 4;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_SC_TA_1 = class extends BaseInformationObject {
    static TID = 0x3A;
    static Description = "Single command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const C_DC_TA_1 = class extends BaseInformationObject {
    static TID = 0x3B;
    static Description = "Double command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const C_RC_TA_1 = class extends BaseInformationObject {
    static TID = 0x3C;
    static Description = "Regulating step command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const C_SE_TA_1 = class extends BaseInformationObject {
    static TID = 0x3D;
    static Description = "Measured value, normalised value command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const C_SE_TB_1 = class extends BaseInformationObject {
    static TID = 0x3E;
    static Description = "Measured value, scaled value command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const C_SE_TC_1 = class extends BaseInformationObject {
    static TID = 0x3F;
    static Description = "Measured value, short floating point number command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const C_BO_TA_1 = class extends BaseInformationObject {
    static TID = 0x40;
    static Description = "Bitstring of 32 bit command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const M_EI_NA_1 = class extends BaseInformationObject {
    static TID = 0x46;
    static Description = "End of Initialisation";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_IC_NA_1 = class extends BaseInformationObject {
    static TID = 0x64;
    static Description = "Interrogation command";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_CI_NA_1 = class extends BaseInformationObject {
    static TID = 0x65;
    static Description = "Counter interrogation command";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_RD_NA_1 = class extends BaseInformationObject {
    static TID = 0x66;
    static Description = "Read Command";
    static ByteLength = 0;
    constructor(bytes) {
        console.log("not implement");
    }
}
// According to IEC-60870-5-101 Chapter 7.3.2
const C_CS_NA_1 = class extends BaseInformationObject {
    static TID = 0x67;
    static Description = "Clock synchronisation command";
    static ByteLength = 7;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_TS_NA_1 = class extends BaseInformationObject {
    static TID = 0x68;
    static Description = "Test command";
    static ByteLength = 2;
    constructor(bytes) {
        if (!(bytes[0] == 0xAA && bytes[1] == 0x55)) {
            throw new Error("非法的参数，测试字固定为AA55");
        }
    }
}
const C_RP_NA_1 = class extends BaseInformationObject {
    static TID = 0x69;
    static Description = "Reset process command";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_CD_NA_1 = class extends BaseInformationObject {
    static TID = 0x6A;
    static Description = "C_CD_NA_1 Delay acquisition command";
    static ByteLength = 2;
    constructor(bytes) {
        console.log("not implement");
    }
}
const C_TS_TA_1 = class extends BaseInformationObject {
    static TID = 0x6B;
    static Description = "Test command with time tag CP56Time2a";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const P_ME_NA_1 = class extends BaseInformationObject {
    static TID = 0x6E;
    static Description = "Parameter of measured values, normalized value";
    static ByteLength = BaseType.NVA.ByteLength + 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const P_ME_NB_1 = class extends BaseInformationObject {
    static TID = 0x6F;
    static Description = "Parameter of measured values, scaled value";
    static ByteLength = BaseType.SVA.ByteLength + 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const P_ME_NC_1 = class extends BaseInformationObject {
    static TID = 0x70;
    static Description = "Parameter of measured values, short floating point number";
    static ByteLength = BaseType.R32.ByteLength + 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const P_AC_NA_1 = class extends BaseInformationObject {
    static TID = 0x71;
    static Description = "Parameter activation";
    static ByteLength = 1;
    constructor(bytes) {
        console.log("not implement");
    }
}
const F_FR_NA_1 = class extends BaseInformationObject {
    static TID = 0x78;
    static Description = "File ready";
    static ByteLength = 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const F_SR_NA_1 = class extends BaseInformationObject {
    static TID = 0x79;
    static Description = "Section ready";
    static ByteLength = 4;
    constructor(bytes) {
        console.log("not implement");
    }
}
const F_SC_NA_1 = class extends BaseInformationObject {
    static TID = 0x7A;
    static Description = "Call directory, select file, call file, call section";
    static ByteLength = 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const F_LS_NA_1 = class extends BaseInformationObject {
    static TID = 0x7B;
    static Description = "Last section, last segment";
    static ByteLength = 4;
    constructor(bytes) {
        console.log("not implement");
    }
}
const F_AF_NA_1 = class extends BaseInformationObject {
    static TID = 0x7C;
    static Description = "ACK file, ACK section";
    static ByteLength = 3;
    constructor(bytes) {
        console.log("not implement");
    }
}
const F_SG_NA_1 = class extends BaseInformationObject {
    static TID = 0x7D;
    static Description = "Segment";
    static ByteLength = 0;
    constructor(bytes) {
        throw new Error("not implement");
    }
}
const F_DR_TA_1 = class extends BaseInformationObject {
    static TID = 0x7E;
    static Description = "Directory";
    static ByteLength = 3 + 7;
    constructor(bytes) {
        console.log("not implement");
    }
}


module.exports = {
    0x01: M_SP_NA_1, 0x02: M_SP_TA_1, 0x03: M_DP_NA_1, 0x04: M_DP_TA_1,
    0x05: M_ST_NA_1, 0x06: M_ST_TA_1, 0x07: M_BO_NA_1, 0x08: M_BO_TA_1,
    0x09: M_ME_NA_1, 0x0A: M_ME_TA_1, 0x0B: M_ME_NB_1, 0x0C: M_ME_TB_1,
    0x0D: M_ME_NC_1, 0x0E: M_ME_TC_1, 0x0F: M_IT_NA_1, 0x10: M_IT_TA_1,
    0x11: M_EP_TA_1, 0x12: M_EP_TB_1, 0x13: M_EP_TC_1, 0x14: M_PS_NA_1,
    0x15: M_ME_ND_1, 0x1E: M_SP_TB_1, 0x1F: M_DP_TB_1, 0x20: M_ST_TB_1,
    0x21: M_BO_TB_1, 0x22: M_ME_TD_1, 0x23: M_ME_TE_1, 0x24: M_ME_TF_1,
    0x25: M_IT_TB_1, 0x26: M_EP_TD_1, 0x27: M_EP_TE_1, 0x28: M_EP_TF_1,
    0x2D: C_SC_NA_1, 0x2E: C_DC_NA_1, 0x2F: C_RC_NA_1, 0x30: C_SE_NA_1,
    0x31: C_SE_NB_1, 0x32: C_SE_NC_1, 0x33: C_BO_NA_1, 0x3A: C_SC_TA_1,
    0x3B: C_DC_TA_1, 0x3C: C_RC_TA_1, 0x3D: C_SE_TA_1, 0x3E: C_SE_TB_1,
    0x3F: C_SE_TC_1, 0x40: C_BO_TA_1, 0x46: M_EI_NA_1, 0x64: C_IC_NA_1,
    0x65: C_CI_NA_1, 0x66: C_RD_NA_1, 0x67: C_CS_NA_1, 0x68: C_TS_NA_1,
    0x69: C_RP_NA_1, 0x6A: C_CD_NA_1, 0x6B: C_TS_TA_1, 0x6E: P_ME_NA_1,
    0x6F: P_ME_NB_1, 0x70: P_ME_NC_1, 0x71: P_AC_NA_1, 0x78: F_FR_NA_1,
    0x79: F_SR_NA_1, 0x7A: F_SC_NA_1, 0x7B: F_LS_NA_1, 0x7C: F_AF_NA_1,
    0x7D: F_SG_NA_1, 0x7E: F_DR_TA_1,

}