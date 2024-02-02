const InfoEle = require('./information-element');
//require('../bytes-ext')
const BaseInformationObject = class {
    static TID = 0x00;
    static Description = 'Abstract information object';
    static InformationObjectStructure = [];
    static get ByteLength() {
        let result = 0;
        for (const i of this.InformationObjectStructure) {
            result += i.ByteLength;
        }
        return result;
    }

    Value = {};

    #stream = null;
    constructor(stream, structure) {
        if (stream != undefined) {
            this.#stream = stream;
            if (structure != undefined) {
                this.initObject(structure);
            }
            else if (this.constructor.InformationObjectStructure != undefined) {
                this.initObject(this.constructor.InformationObjectStructure);
            }
        }

    }

    initObject(structure) {
        for (const i of structure) {
            const args = [this.#stream.Read(i.ByteLength)];
            this.Value[i.Name] = Reflect.construct(i, args);
        }
    }
}

// According to IEC-60870-5-101 Chapter 7.3.1 and IEC-60870-5-104 2009
const M_SP_NA_1 = class extends BaseInformationObject {
    static TID = 0x01;
    static Description = 'Single-point information';
    static InformationObjectStructure = [InfoEle.SIQ];

}

const M_SP_TA_1 = class extends M_SP_NA_1 {
    static TID = 0x02;
    static Description = 'Single-point information with time tag';
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a];
}

const M_DP_NA_1 = class extends BaseInformationObject {
    static TID = 0x03;
    static Description = 'Double-point information'
    static InformationObjectStructure = [InfoEle.DIQ];
}

const M_DP_TA_1 = class extends BaseInformationObject {
    static TID = 0x04;
    static Description = "Double-point information with time tag";
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a];
}
const M_ST_NA_1 = class extends BaseInformationObject {
    static TID = 0x05;
    static Description = "Step position information";
    static InformationObjectStructure = [InfoEle.VTI, InfoEle.QDS];

}
const M_ST_TA_1 = class extends M_ST_NA_1 {
    static TID = 0x06;
    static Description = "Step position information with time tag";
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a];
}
const M_BO_NA_1 = class extends BaseInformationObject {
    static TID = 0x07;
    static Description = "Bitstring of 32 bit with quality";
    static InformationObjectStructure = [InfoEle.BSI, InfoEle.QDS];
}
const M_BO_TA_1 = class extends M_BO_NA_1 {
    static TID = 0x08;
    static Description = "Bitstring of 32 bit with quality and time tag";
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a.ByteLength];
}
const M_ME_NA_1 = class extends BaseInformationObject {
    static TID = 0x09;
    static Description = "Measured value, normalised value";
    static InformationObjectStructure = [InfoEle.NVA, InfoEle.QDS];
}
const M_ME_TA_1 = class extends M_ME_NA_1 {
    static TID = 0x0A;
    static Description = "Measured value, normalized value with time tag";
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a];
}
const M_ME_NB_1 = class extends BaseInformationObject {
    static TID = 0x0B;
    static InformationObjectStructure = [InfoEle.SVA, InfoEle.QDS];
    static Description = "Measured value, scaled value";
}
const M_ME_TB_1 = class extends M_ME_NB_1 {
    static TID = 0x0C;
    static Description = "Measured value, scaled value wit time tag";
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a];
}
const M_ME_NC_1 = class extends BaseInformationObject {
    static TID = 0x0D;
    static Description = "Measured value, short floating point number";
    static InformationObjectStructure = [InfoEle.R32, InfoEle.QDS];
}
const M_ME_TC_1 = class extends M_ME_NC_1 {
    static TID = 0x0E;
    static Description = "Measured value, short floating point number with time tag";
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a];
}
const M_IT_NA_1 = class extends BaseInformationObject {
    static TID = 0x0F;
    static Description = "Integrated totals";
    static InformationObjectStructure = [InfoEle.BCR];
}
const M_IT_TA_1 = class extends M_IT_NA_1 {
    static TID = 0x10;
    static Description = "Integrated totals with time tag";
    static InformationObjectStructure = [...super.InformationObjectStructure, InfoEle.CP24Time2a];

}
const M_EP_TA_1 = class extends BaseInformationObject {
    static TID = 0x11;
    static Description = "Event of protection equipment with time tag";
    static InformationObjectStructure = [InfoEle.SEP, InfoEle.CP16Time2a, InfoEle.CP24Time2a];

}
const M_EP_TB_1 = class extends BaseInformationObject {
    static TID = 0x12;
    static Description = "Packed start events of protection equipment with time tag";
    static InformationObjectStructure = [InfoEle.SPE, InfoEle.QDP, InfoEle.CP16Time2a, InfoEle.CP24Time2a]

}
const M_EP_TC_1 = class extends BaseInformationObject {
    static TID = 0x13;
    static Description = "Packed output circuit information of protection equipment with time tag";
    static InformationObjectStructure = [InfoEle.OCI, InfoEle.QDP, InfoEle.CP16Time2a, InfoEle.CP24Time2a];
}

const M_PS_NA_1 = class extends BaseInformationObject {
    static TID = 0x14;
    static Description = "Packed single point information with status change detection";
    static InformationObjectStructure = [InfoEle.SCD, InfoEle.QDS];
}
const M_ME_ND_1 = class extends BaseInformationObject {
    static TID = 0x15;
    static Description = "Measured value, normalized value without quality descriptor";
    static InformationObjectStructure = [InfoEle.NVA];
}

const M_SP_TB_1 = class extends BaseInformationObject {
    static TID = 0x1E;
    static Description = "Single-point information with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.SIQ, InfoEle.CP56Time2a];
}
const M_DP_TB_1 = class extends BaseInformationObject {
    static TID = 0x1F;
    static Description = "Double-point information with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.DIQ, InfoEle.CP56Time2a];
}
const M_ST_TB_1 = class extends BaseInformationObject {
    static TID = 0x20;
    static Description = "Step position information with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.VTI, InfoEle.QDS, InfoEle.CP56Time2a];
}
const M_BO_TB_1 = class extends BaseInformationObject {
    static TID = 0x21;
    static Description = "Bitstring of 32 bit with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.BSI, InfoEle.QDS, InfoEle.CP56Time2a];
}
const M_ME_TD_1 = class extends BaseInformationObject {
    static TID = 0x22;
    static Description = "Measured value, normalized value with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.NVA, InfoEle.QDS, InfoEle.CP56Time2a];
}

const M_ME_TE_1 = class extends BaseInformationObject {
    static TID = 0x23;
    static Description = "Measured value, scaled value with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.SVA, InfoEle.QDS, InfoEle.CP56Time2a];
}
const M_ME_TF_1 = class extends BaseInformationObject {
    static TID = 0x24;
    static Description = "Measured value, short floating point number with time tag CP56Time2a";
    static ByteLength = [InfoEle.R32, InfoEle.QDS, InfoEle.CP56Time2a];
}
const M_IT_TB_1 = class extends BaseInformationObject {
    static TID = 0x25;
    static Description = "Integrated totals with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.BCR, InfoEle.CP56Time2a];
}
const M_EP_TD_1 = class extends BaseInformationObject {
    static TID = 0x26;
    static Description = "Event of protection equipment with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.SEP, InfoEle.CP16Time2a, InfoEle.CP56Time2a];
}
const M_EP_TE_1 = class extends BaseInformationObject {
    static TID = 0x27;
    static Description = "Packed start events of protection equipment with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.SPE, InfoEle.QDP, InfoEle.CP16Time2a, InfoEle.CP56Time2a];
}
const M_EP_TF_1 = class extends BaseInformationObject {
    static TID = 0x28;
    static Description = "Packed output circuit information of protection equipment with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.OCI, InfoEle.QDP, InfoEle.CP16Time2a, InfoEle.CP56Time2a];
}
const C_SC_NA_1 = class extends BaseInformationObject {
    static TID = 0x2D;
    static Description = "Single command";
    static InformationObjectStructure = [InfoEle.SCO];
}
const C_DC_NA_1 = class extends BaseInformationObject {
    static TID = 0x2E;
    static Description = "Double command";
    static InformationObjectStructure = [InfoEle.DCO];
}
const C_RC_NA_1 = class extends BaseInformationObject {
    static TID = 0x2F;
    static Description = "Regulating step command";
    static InformationObjectStructure = [InfoEle.RCO];
}
const C_SE_NA_1 = class extends BaseInformationObject {
    static TID = 0x30;
    static Description = "Set-point Command, normalized value";
    static InformationObjectStructure = [InfoEle.NVA, InfoEle.QOS];
}
const C_SE_NB_1 = class extends BaseInformationObject {
    static TID = 0x31;
    static Description = "Set-point Command, scaled value";
    static InformationObjectStructure = [InfoEle.SVA, InfoEle.QOS];
}
const C_SE_NC_1 = class extends BaseInformationObject {
    static TID = 0x32;
    static Description = "Set-point Command, short floating point number";
    static InformationObjectStructure = [InfoEle.R32, InfoEle.QOS];
}
const C_BO_NA_1 = class extends BaseInformationObject {
    static TID = 0x33;
    static Description = "Bitstring 32 bit command";
    static InformationObjectStructure = [InfoEle.BSI];
}

const C_SC_TA_1 = class extends BaseInformationObject {
    static TID = 0x3A;
    static Description = "Single command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.SCO, InfoEle.CP56Time2a];
}

const C_DC_TA_1 = class extends BaseInformationObject {
    static TID = 0x3B;
    static Description = "Double command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.DCO, InfoEle.CP56Time2a];
}

const C_RC_TA_1 = class extends BaseInformationObject {
    static TID = 0x3C;
    static Description = "Regulating step command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.RCO, InfoEle.CP56Time2a];
}

const C_SE_TA_1 = class extends BaseInformationObject {
    static TID = 0x3D;
    static Description = "Measured value, normalised value command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.NVA, InfoEle.QOS, InfoEle.CP56Time2a];
}

const C_SE_TB_1 = class extends BaseInformationObject {
    static TID = 0x3E;
    static Description = "Measured value, scaled value command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.SVA, InfoEle.QOS, InfoEle.CP56Time2a];
}

const C_SE_TC_1 = class extends BaseInformationObject {
    static TID = 0x3F;
    static Description = "Measured value, short floating point number command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.R32, InfoEle.QOS, InfoEle.CP56Time2a];
}

const C_BO_TA_1 = class extends BaseInformationObject {
    static TID = 0x40;
    static Description = "Bitstring of 32 bit command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.BSI, InfoEle.CP56Time2a];
}
const M_EI_NA_1 = class extends BaseInformationObject {
    static TID = 0x46;
    static Description = "End of Initialization";
    static InformationObjectStructure = [InfoEle.COI];
}
const C_IC_NA_1 = class extends BaseInformationObject {
    static TID = 0x64;
    static Description = "Interrogation command";
    static InformationObjectStructure = [InfoEle.QOI];
}
const C_CI_NA_1 = class extends BaseInformationObject {
    static TID = 0x65;
    static Description = "Counter interrogation command";
    static InformationObjectStructure = [InfoEle.QCC];
}
const C_RD_NA_1 = class extends BaseInformationObject {
    static TID = 0x66;
    static Description = "Read Command";
    static InformationObjectStructure = [];
}
// According to IEC-60870-5-101 Chapter 7.3.2
const C_CS_NA_1 = class extends BaseInformationObject {
    static TID = 0x67;
    static Description = "Clock synchronization command";
    static InformationObjectStructure = [InfoEle.CP56Time2a];
}
const C_TS_NA_1 = class extends BaseInformationObject {
    static TID = 0x68;
    static Description = "Test command";
    static InformationObjectStructure = [InfoEle.FBP];
}
const C_RP_NA_1 = class extends BaseInformationObject {
    static TID = 0x69;
    static Description = "Reset process command";
    static InformationObjectStructure = [InfoEle.GRP];
}
const C_CD_NA_1 = class extends BaseInformationObject {
    static TID = 0x6A;
    static Description = "C_CD_NA_1 Delay acquisition command";
    static InformationObjectStructure = [InfoEle.CP16Time2a];
}

const C_TS_TA_1 = class extends BaseInformationObject {
    static TID = 0x6B;
    static Description = "Test command with time tag CP56Time2a";
    static InformationObjectStructure = [InfoEle.TSC, InfoEle.CP56Time2a];
}
const P_ME_NA_1 = class extends BaseInformationObject {
    static TID = 0x6E;
    static Description = "Parameter of measured values, normalized value";
    static InformationObjectStructure = [InfoEle.NVA, InfoEle.QPM];
}
const P_ME_NB_1 = class extends BaseInformationObject {
    static TID = 0x6F;
    static Description = "Parameter of measured values, scaled value";
    static InformationObjectStructure = [InfoEle.SVA, InfoEle.QPM];
}
const P_ME_NC_1 = class extends BaseInformationObject {
    static TID = 0x70;
    static Description = "Parameter of measured values, short floating point number";
    static InformationObjectStructure = [InfoEle.R32, InfoEle.QPM];
}
const P_AC_NA_1 = class extends BaseInformationObject {
    static TID = 0x71;
    static Description = "Parameter activation";
    static InformationObjectStructure = [InfoEle.QPA];
}
const F_FR_NA_1 = class extends BaseInformationObject {
    static TID = 0x78;
    static Description = "File ready";
    static InformationObjectStructure = [InfoEle.NOF, InfoEle.LOF, InfoEle.FRQ];
}
const F_SR_NA_1 = class extends BaseInformationObject {
    static TID = 0x79;
    static Description = "Section ready";
    static ByteLength = [InfoEle.NOF, InfoEle.NOS, InfoEle.LOS];
}
const F_SC_NA_1 = class extends BaseInformationObject {
    static TID = 0x7A;
    static Description = "Call directory, select file, call file, call section";
    static InformationObjectStructure = [InfoEle.NOF, InfoEle.NOS, InfoEle.SCQ];
}
const F_LS_NA_1 = class extends BaseInformationObject {
    static TID = 0x7B;
    static Description = "Last section, last segment";
    static InformationObjectStructure = [InfoEle.NOF, InfoEle.NOS, InfoEle.LSQ, InfoEle.CHS];
}
const F_AF_NA_1 = class extends BaseInformationObject {
    static TID = 0x7C;
    static Description = "ACK file, ACK section";
    static InformationObjectStructure = [InfoEle.NOF, InfoEle.NOS, InfoEle.AFQ];
}
const F_SG_NA_1 = class extends BaseInformationObject {
    static TID = 0x7D;
    static Description = "Segment";
    static InformationObjectStructure = [InfoEle.NOF, InfoEle.NOS, InfoEle.LOS];
   
    constructor(stream) {
        let tmp = {};
        for (const i of F_SG_NA_1.InformationObjectStructure) {
            const args = [stream.Read(i.ByteLength)];
            tmp[i.Name] = Reflect.construct(i, args);
        }
        const len_seg = tmp['LOS'].Value;
        tmp['Segment'] = stream.Read(len_seg);
        super();
        this.Value = tmp;

    }
}
const F_DR_TA_1 = class extends BaseInformationObject {
    static TID = 0x7E;
    static Description = "Directory";
    static InformationObjectStructure = [InfoEle.NOF, InfoEle.LOF, InfoEle.SOF, InfoEle.CP56Time2a];
}

const F_SC_NB_1 = class extends BaseInformationObject {
    static TID = 0x7F;
    static Description = 'Query Log';
    static InformationObjectStructure = [InfoEle.NOF, InfoEle.CP56Time2a, InfoEle.CP56Time2a];
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
    0x7D: F_SG_NA_1, 0x7E: F_DR_TA_1, 0x7F: F_SC_NB_1

}