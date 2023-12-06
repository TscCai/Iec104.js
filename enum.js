const UFormatSignalling = Object.freeze({
    STARTDT_Order: 0x07,
    STARTDT_Confirm: 0x0B,
    STOPDT_Order: 0x13,
    STOPDT_Confirm: 0x23,
    TESTFR_Order: 0x43,
    TESTFR_Confirm: 0x83,
    toString: function (enumValue) {
        if (Array.isArray(enumValue) && enumValue.length > 0) {
            enumValue = enumValue[0];
        }
        switch (enumValue) {
            case this.STARTDT_Confirm:
                return 'Start Confirm';
            case this.STARTDT_Order:
                return 'Start Order';
            case this.STOPDT_Confirm:
                return 'Stop Confirm';
            case this.STOPDT_Order:
                return 'Stop Order';
            case this.TESTFR_Confirm:
                return 'Test Confirm';
            case this.TESTFR_Order:
                return 'Test Order';
            default:
                throw new Error("无效的传入参数，非法的U格式帧控制域。");
        }
    }
});
/*
const AsduType = Object.freeze({
    M_SP_NA_1: 0x01,    //Single-point information
    M_SP_TA_1: 0x02,    //Single-point information with time tag
    M_DP_NA_1: 0x03,    //Double-point information
    M_DP_TA_1: 0x04,    //Double-point information with time tag
    M_ST_NA_1: 0x05,    //Step position information
    M_ST_TA_1: 0x06,    //Step position information with time tag
    M_BO_NA_1: 0x07,    //Bitstring of 32 bit
    M_BO_TA_1: 0x08,    //Bitstring of 32 bit with time tag
    M_ME_NA_1: 0x09,    //Measured value, normalised value
    M_ME_TA_1: 0x0A,    //Measured value, normalized value with time tag
    M_ME_NB_1: 0x0B,    //Measured value, scaled value
    M_ME_TB_1: 0x0C,    //Measured value, scaled value wit time tag
    M_ME_NC_1: 0x0D,    //Measured value, short floating point number
    M_ME_TC_1: 0x0E,    //Measured value, short floating point number with time tag
    M_IT_NA_1: 0x0F,    //Integrated totals
    M_IT_TA_1: 0x10,    //Integrated totals with time tag
    M_EP_TA_1: 0x11,    //Event of protection equipment with time tag
    M_EP_TB_1: 0x12,    //Packed start events of protection equipment with time tag
    M_EP_TC_1: 0x13,    //Packed output circuit information of protection equipment with time tag
    M_PS_NA_1: 0x14,    //Packed single point information with status change detection
    M_ME_ND_1: 0x15,    //Measured value, normalized value without quality descriptor
    ASDU_TYPE_22: 0x16,
    ASDU_TYPE_23: 0x17,
    ASDU_TYPE_24: 0x18,
    ASDU_TYPE_25: 0x19,
    ASDU_TYPE_26: 0x1A,
    ASDU_TYPE_27: 0x1B,
    ASDU_TYPE_28: 0x1C,
    ASDU_TYPE_29: 0x1D,
    M_SP_TB_1: 0x1E,    //Single-point information with time tag CP56Time2a
    M_DP_TB_1: 0x1F,    //Double-point information with time tag CP56Time2a
    M_ST_TB_1: 0x20,    //Step position information with time tag CP56Time2a
    M_BO_TB_1: 0x21,    //Bitstring of 32 bit with time tag CP56Time2a
    M_ME_TD_1: 0x22,    //Measured value, normalised value with time tag CP56Time2a
    M_ME_TE_1: 0x23,    //Measured value, scaled value with time tag CP56Time2a
    M_ME_TF_1: 0x24,    //Measured value, short floating point number with time tag CP56Time2a
    M_IT_TB_1: 0x25,    //Integrated totals with time tag CP56Time2a
    M_EP_TD_1: 0x26,    //Event of protection equipment with time tag CP56Time2a
    M_EP_TE_1: 0x27,    //Packed start events of protection equipment with time tag CP56Time2a
    M_EP_TF_1: 0x28,    //Packed output circuit information of protection equipment with time tag CP56Time2a
    ASDU_TYPE_41: 0x29,
    ASDU_TYPE_42: 0x2A,
    ASDU_TYPE_43: 0x2B,
    ASDU_TYPE_44: 0x2C,
    C_SC_NA_1: 0x2D,    //Single command
    C_DC_NA_1: 0x2E,    //Double command
    C_RC_NA_1: 0x2F,    //Regulating step command
    C_SE_NA_1: 0x30,    //Set-point Command, normalised value
    C_SE_NB_1: 0x31,    //Set-point Command, scaled value
    C_SE_NC_1: 0x32,    //Set-point Command, short floating point number
    C_BO_NA_1: 0x33,    //Bitstring 32 bit command
    ASDU_TYPE_52: 0x34,
    ASDU_TYPE_53: 0x35,
    ASDU_TYPE_54: 0x36,
    ASDU_TYPE_55: 0x37,
    ASDU_TYPE_56: 0x38,
    ASDU_TYPE_57: 0x39,
    C_SC_TA_1: 0x3A,    //Single command with time tag CP56Time2a
    C_DC_TA_1: 0x3B,    //Double command with time tag CP56Time2a
    C_RC_TA_1: 0x3C,    //Regulating step command with time tag CP56Time2a
    C_SE_TA_1: 0x3D,    //Measured value, normalised value command with time tag CP56Time2a
    C_SE_TB_1: 0x3E,    //Measured value, scaled value command with time tag CP56Time2a
    C_SE_TC_1: 0x3F,    //Measured value, short floating point number command with time tag CP56Time2a
    C_BO_TA_1: 0x40,    //Bitstring of 32 bit command with time tag CP56Time2a
    ASDU_TYPE_65: 0x41,
    ASDU_TYPE_66: 0x42,
    ASDU_TYPE_67: 0x43,
    ASDU_TYPE_68: 0x44,
    ASDU_TYPE_69: 0x45,
    M_EI_NA_1: 0x46,    //End of Initialisation
    ASDU_TYPE_71: 0x47,
    ASDU_TYPE_72: 0x48,
    ASDU_TYPE_73: 0x49,
    ASDU_TYPE_74: 0x4A,
    ASDU_TYPE_75: 0x4B,
    ASDU_TYPE_76: 0x4C,
    ASDU_TYPE_77: 0x4D,
    ASDU_TYPE_78: 0x4E,
    ASDU_TYPE_79: 0x4F,
    ASDU_TYPE_80: 0x50,
    ASDU_TYPE_81: 0x51,
    ASDU_TYPE_82: 0x52,
    ASDU_TYPE_83: 0x53,
    ASDU_TYPE_84: 0x54,
    ASDU_TYPE_85: 0x55,
    ASDU_TYPE_86: 0x56,
    ASDU_TYPE_87: 0x57,
    ASDU_TYPE_88: 0x58,
    ASDU_TYPE_89: 0x59,
    ASDU_TYPE_90: 0x5A,
    ASDU_TYPE_91: 0x5B,
    ASDU_TYPE_92: 0x5C,
    ASDU_TYPE_93: 0x5D,
    ASDU_TYPE_94: 0x5E,
    ASDU_TYPE_95: 0x5F,
    ASDU_TYPE_96: 0x60,
    ASDU_TYPE_97: 0x61,
    ASDU_TYPE_98: 0x62,
    ASDU_TYPE_99: 0x63,
    C_IC_NA_1: 0x64,    //Interrogation command
    C_CI_NA_1: 0x65,    //Counter interrogation command
    C_RD_NA_1: 0x66,    //Read Command
    C_CS_NA_1: 0x67,    //Clock synchronisation command
    C_TS_NA_1: 0x68,    //Test command
    C_RP_NA_1: 0x69,    //Reset process command
    C_CD_NA_1: 0x6A,    //C_CD_NA_1 Delay acquisition command
    C_TS_TA_1: 0x6B,    //Test command with time tag CP56Time2a
    ASDU_TYPE_108: 0x6C,
    ASDU_TYPE_109: 0x6D,
    P_ME_NA_1: 0x6E,    //Parameter of measured values, normalized value
    P_ME_NB_1: 0x6F,    //Parameter of measured values, scaled value
    P_ME_NC_1: 0x70,    //Parameter of measured values, short floating point number
    P_AC_NA_1: 0x71,    //Parameter activation
    ASDU_TYPE_114: 0x72,
    ASDU_TYPE_115: 0x73,
    ASDU_TYPE_116: 0x74,
    ASDU_TYPE_117: 0x75,
    ASDU_TYPE_118: 0x76,
    ASDU_TYPE_119: 0x77,
    F_FR_NA_1: 0x78,    //File ready
    F_SR_NA_1: 0x79,    //Section ready
    F_SC_NA_1: 0x7A,    //Call directory, select file, call file, call section
    F_LS_NA_1: 0x7B,    //Last section, last segment
    F_AF_NA_1: 0x7C,    //ACK file, ACK section
    F_SG_NA_1: 0x7D,    //Segment
    F_DR_TA_1: 0x7E,    //Directory
    ASDU_TYPE_127: 0x7D,//Reserved user asdu types
    ASDU_TYPE_140: 0x8A,
    ASDU_TYPE_141: 0x8B,
    ASDU_TYPE_142: 0x8C,
    ASDU_TYPE_143: 0x8D,
    ASDU_TYPE_144: 0x8E,
    ASDU_TYPE_145: 0x8F,
    ASDU_TYPE_146: 0x90,
    ASDU_TYPE_147: 0x91,
    ASDU_TYPE_148: 0x92,
    ASDU_TYPE_149: 0x93,
    ASDU_TYPE_150: 0x94,
    ASDU_TYPE_151: 0x95,
    ASDU_TYPE_152: 0x96,
    ASDU_TYPE_153: 0x97,
    ASDU_TYPE_154: 0x98,
    ASDU_TYPE_155: 0x99,
    ASDU_TYPE_156: 0x9A,
    ASDU_TYPE_157: 0x9B,
    ASDU_TYPE_158: 0x9C,
    ASDU_TYPE_159: 0x9D,
    ASDU_TYPE_160: 0x9E,
    ASDU_TYPE_161: 0x9F,
    ASDU_TYPE_162: 0xA0,
    ASDU_TYPE_163: 0xA1,
    ASDU_TYPE_164: 0xA2,
    ASDU_TYPE_165: 0xA3,
    ASDU_TYPE_166: 0xA4,
    ASDU_TYPE_167: 0xA5,
    ASDU_TYPE_168: 0xA6,
    ASDU_TYPE_169: 0xA7,
    ASDU_TYPE_170: 0xA8,
    ASDU_TYPE_171: 0xA9,
    ASDU_TYPE_172: 0xAA,
    ASDU_TYPE_173: 0xAB,
    ASDU_TYPE_174: 0xAC,
    ASDU_TYPE_175: 0xAD,
    ASDU_TYPE_176: 0xAE,
    ASDU_TYPE_177: 0xAF,
    ASDU_TYPE_178: 0xB0,
    ASDU_TYPE_179: 0xB1,
    ASDU_TYPE_180: 0xB2,
    ASDU_TYPE_181: 0xB3,
    ASDU_TYPE_182: 0xB4,
    ASDU_TYPE_183: 0xB5,
    ASDU_TYPE_184: 0xB6,
    ASDU_TYPE_185: 0xB7,
    ASDU_TYPE_186: 0xB8,
    ASDU_TYPE_187: 0xB9,
    ASDU_TYPE_188: 0xBA,
    ASDU_TYPE_189: 0xBB,
    ASDU_TYPE_190: 0xBC,
    ASDU_TYPE_191: 0xBD,
    ASDU_TYPE_192: 0xBE,
    ASDU_TYPE_193: 0xBF,
    ASDU_TYPE_194: 0xC0,
    ASDU_TYPE_195: 0xC1,
    ASDU_TYPE_196: 0xC2,
    ASDU_TYPE_197: 0xC3,
    ASDU_TYPE_198: 0xC4,
    ASDU_TYPE_199: 0xC5,
    ASDU_TYPE_200: 0xC6,
    ASDU_TYPE_201: 0xC7,
    ASDU_TYPE_202: 0xC8,
    ASDU_TYPE_203: 0xC9,
    ASDU_TYPE_204: 0xCA,
    ASDU_TYPE_205: 0xCB,
    ASDU_TYPE_206: 0xCC,
    ASDU_TYPE_207: 0xCD,
    ASDU_TYPE_208: 0xCE,
    ASDU_TYPE_209: 0xCF,
    ASDU_TYPE_210: 0xD0,
    ASDU_TYPE_211: 0xD1,
    ASDU_TYPE_212: 0xD2,
    ASDU_TYPE_213: 0xD3,
    ASDU_TYPE_214: 0xD4,
    ASDU_TYPE_215: 0xD5,
    ASDU_TYPE_216: 0xD6,
    ASDU_TYPE_217: 0xD7,
    ASDU_TYPE_218: 0xD8,
    ASDU_TYPE_219: 0xD9,
    ASDU_TYPE_220: 0xDA,
    ASDU_TYPE_221: 0xDB,
    ASDU_TYPE_222: 0xDC,
    ASDU_TYPE_223: 0xDD,
    ASDU_TYPE_224: 0xDE,
    ASDU_TYPE_225: 0xDF,
    ASDU_TYPE_226: 0xE0,
    ASDU_TYPE_227: 0xE1,
    ASDU_TYPE_228: 0xE2,
    ASDU_TYPE_229: 0xE3,
    ASDU_TYPE_230: 0xE4,
    ASDU_TYPE_231: 0xE5,
    ASDU_TYPE_232: 0xE6,
    ASDU_TYPE_233: 0xE7,
    ASDU_TYPE_234: 0xE8,
    ASDU_TYPE_235: 0xE9,
    ASDU_TYPE_236: 0xEA,
    ASDU_TYPE_237: 0xEB,
    ASDU_TYPE_238: 0xEC,
    ASDU_TYPE_239: 0xED,
    ASDU_TYPE_240: 0xEE,
    ASDU_TYPE_241: 0xEF,
    ASDU_TYPE_242: 0xF0,
    ASDU_TYPE_243: 0xF1,
    ASDU_TYPE_244: 0xF2,
    ASDU_TYPE_245: 0xF3,
    ASDU_TYPE_246: 0xF4,
    ASDU_TYPE_247: 0xF5,
    ASDU_TYPE_248: 0xF6,
    ASDU_TYPE_249: 0xF7,
    ASDU_TYPE_250: 0xF8,
    ASDU_TYPE_251: 0xF9,
    ASDU_TYPE_252: 0xFA,
    ASDU_TYPE_253: 0xFB,
    ASDU_TYPE_254: 0xFC,
    ASDU_TYPE_255: 0xFD,
    toString: function (enumValue) {
        if (Array.isArray(enumValue) && enumValue.length > 0) {
            enumValue = enumValue[0];
        }
        switch (enumValue) {
            case this.M_SP_NA_1: return 'Single-point information';
            case this.M_SP_TA_1: return 'Single-point information with time tag';
            case this.M_DP_NA_1: return 'Double-point information';
            case this.M_DP_TA_1: return 'Double-point information with time tag';
            case this.M_ST_NA_1: return 'Step position information';
            case this.M_ST_TA_1: return 'Step position information with time tag';
            case this.M_BO_NA_1: return 'Bitstring of 32 bit';
            case this.M_BO_TA_1: return 'Bitstring of 32 bit with time tag';
            case this.M_ME_NA_1: return 'Measured value, normalised value';
            case this.M_ME_TA_1: return 'Measured value, normalized value with time tag';
            case this.M_ME_NB_1: return 'Measured value, scaled value';
            case this.M_ME_TB_1: return 'Measured value, scaled value wit time tag';
            case this.M_ME_NC_1: return 'Measured value, short floating point number';
            case this.M_ME_TC_1: return 'Measured value, short floating point number with time tag';
            case this.M_IT_NA_1: return 'Integrated totals';
            case this.M_IT_TA_1: return 'Integrated totals with time tag';
            case this.M_EP_TA_1: return 'Event of protection equipment with time tag';
            case this.M_EP_TB_1: return 'Packed start events of protection equipment with time tag';
            case this.M_EP_TC_1: return 'Packed output circuit information of protection equipment with time tag';
            case this.M_PS_NA_1: return 'Packed single point information with status change detection';
            case this.M_ME_ND_1: return 'Measured value, normalized value without quality descriptor';
            case this.M_SP_TB_1: return 'Single-point information with time tag CP56Time2a';
            case this.M_DP_TB_1: return 'Double-point information with time tag CP56Time2a';
            case this.M_ST_TB_1: return 'Step position information with time tag CP56Time2a';
            case this.M_BO_TB_1: return 'Bitstring of 32 bit with time tag CP56Time2a';
            case this.M_ME_TD_1: return 'Measured value, normalised value with time tag CP56Time2a';
            case this.M_ME_TE_1: return 'Measured value, scaled value with time tag CP56Time2a';
            case this.M_ME_TF_1: return 'Measured value, short floating point number with time tag CP56Time2a';
            case this.M_IT_TB_1: return 'Integrated totals with time tag CP56Time2a';
            case this.M_EP_TD_1: return 'Event of protection equipment with time tag CP56Time2a';
            case this.M_EP_TE_1: return 'Packed start events of protection equipment with time tag CP56Time2a';
            case this.M_EP_TF_1: return 'Packed output circuit information of protection equipment with time tag CP56Time2a';
            case this.C_SC_NA_1: return 'Single command';
            case this.C_DC_NA_1: return 'Double command';
            case this.C_RC_NA_1: return 'Regulating step command';
            case this.C_SE_NA_1: return 'Set-point Command, normalised value';
            case this.C_SE_NB_1: return 'Set-point Command, scaled value';
            case this.C_SE_NC_1: return 'Set-point Command, short floating point number';
            case this.C_BO_NA_1: return 'Bitstring 32 bit command';
            case this.C_SC_TA_1: return 'Single command with time tag CP56Time2a';
            case this.C_DC_TA_1: return 'Double command with time tag CP56Time2a';
            case this.C_RC_TA_1: return 'Regulating step command with time tag CP56Time2a';
            case this.C_SE_TA_1: return 'Measured value, normalised value command with time tag CP56Time2a';
            case this.C_SE_TB_1: return 'Measured value, scaled value command with time tag CP56Time2a';
            case this.C_SE_TC_1: return 'Measured value, short floating point number command with time tag CP56Time2a';
            case this.C_BO_TA_1: return 'Bitstring of 32 bit command with time tag CP56Time2a';
            case this.M_EI_NA_1: return 'End of Initialisation';
            case this.C_IC_NA_1: return 'Interrogation command';
            case this.C_CI_NA_1: return 'Counter interrogation command';
            case this.C_RD_NA_1: return 'Read Command';
            case this.C_CS_NA_1: return 'Clock synchronisation command';
            case this.C_TS_NA_1: return 'Test command';
            case this.C_RP_NA_1: return 'Reset process command';
            case this.C_CD_NA_1: return 'C_CD_NA_1 Delay acquisition command';
            case this.C_TS_TA_1: return 'Test command with time tag CP56Time2a';
            case this.P_ME_NA_1: return 'Parameter of measured values, normalized value';
            case this.P_ME_NB_1: return 'Parameter of measured values, scaled value';
            case this.P_ME_NC_1: return 'Parameter of measured values, short floating point number';
            case this.P_AC_NA_1: return 'Parameter activation';
            case this.F_FR_NA_1: return 'File ready';
            case this.F_SR_NA_1: return 'Section ready';
            case this.F_SC_NA_1: return 'Call directory, select file, call file, call section';
            case this.F_LS_NA_1: return 'Last section, last segment';
            case this.F_AF_NA_1: return 'ACK file, ACK section';
            case this.F_SG_NA_1: return 'Segment';
            case this.F_DR_TA_1: return 'Directory';

            case (enumValue >= this.ASDU_TYPE_22 && enumValue <= this.ASDU_TYPE_29):
            case (enumValue >= this.ASDU_TYPE_41 && enumValue <= this.ASDU_TYPE_44):
            case (enumValue >= this.ASDU_TYPE_52 && enumValue <= this.ASDU_TYPE_57):
            case (enumValue >= this.ASDU_TYPE_65 && enumValue <= this.ASDU_TYPE_69):
            case (enumValue >= this.ASDU_TYPE_71 && enumValue <= this.ASDU_TYPE_99):
            case (enumValue >= this.ASDU_TYPE_108 && enumValue <= this.ASDU_TYPE_109):
            case (enumValue >= this.ASDU_TYPE_114 && enumValue <= this.ASDU_TYPE_119):
            case (enumValue >= this.ASDU_TYPE_140 && enumValue <= this.ASDU_TYPE_255): return 'Unknown ASDU type';
            case (enumValue >= this.ASDU_TYPE_127 && enumValue < this.ASDU_TYPE_140): return 'Reserved user ASDU types';
            default:
                throw new Error("非法的传入参数，enumValue应为合法的ASDU类别枚举值。");

        }
    }
});*/

const CotType = Object.freeze({
    COT_UNUSED: 0,
    COT_CYCLIC: 1,
    COT_BACKGROUND: 2,
    COT_SPONTAN: 3,
    COT_INIT: 4,
    COT_REQ: 5,
    COT_ACT: 6,
    COT_ACT_CON: 7,
    COT_DEACT: 8,
    COT_DEACT_CON: 9,
    COT_ACT_TERM: 10,
    COT_RETREM: 11,
    COT_RETLOC: 12,
    COT_FILE: 13,
    COT_14: 14,
    COT_15: 15,
    COT_16: 16,
    COT_17: 17,
    COT_18: 18,
    COT_19: 19,
    COT_INROGEN: 20,
    COT_INRO1: 21,
    COT_INRO2: 22,
    COT_INRO3: 23,
    COT_INRO4: 24,
    COT_INRO5: 25,
    COT_INRO6: 26,
    COT_INRO7: 27,
    COT_INRO8: 28,
    COT_INRO9: 29,
    COT_INRO10: 30,
    COT_INRO11: 31,
    COT_INRO12: 32,
    COT_INRO13: 33,
    COT_INRO14: 34,
    COT_INRO15: 35,
    COT_INRO16: 36,
    COT_REQCOGEN: 37,
    COT_REQCO1: 38,
    COT_REQCO2: 39,
    COT_REQCO3: 40,
    COT_REQCO4: 41,
    COT_42: 42,
    COT_43: 43,
    COT_UNKNOWN_TYPE: 44,
    COT_UNKNOWN_CAUSE: 45,
    COT_UNKNOWN_ASDU_ADDRESS: 46,
    COT_UNKNOWN_OBJECT_ADDRESS: 47,
    COT_48: 48,
    COT_49: 49,
    COT_50: 50,
    COT_51: 51,
    COT_52: 52,
    COT_53: 53,
    COT_54: 54,
    COT_55: 55,
    COT_56: 56,
    COT_57: 57,
    COT_58: 58,
    COT_59: 59,
    COT_60: 60,
    COT_61: 61,
    COT_62: 62,
    COT_63: 63,
    toString(enumValue) {
        if (Array.isArray(enumValue) && enumValue.length > 0) {
            enumValue = enumValue[0];
        }
        switch (enumValue) {
            case this.COT_UNUSED: return 'Is not used';
            case this.COT_CYCLIC: return ' Cyclic data';
            case this.COT_BACKGROUND: return 'Background scan';
            case this.COT_SPONTAN: return 'Spontaneous data';
            case this.COT_INIT: return 'End of initialization';
            case this.COT_REQ: return 'Read request';
            case this.COT_ACT: return 'Command activation';
            case this.COT_ACT_CON: return 'Confirmation of command activation';
            case this.COT_DEACT: return 'Command abortion';
            case this.COT_DEACT_CON: return 'Confirmation of command abortion';
            case this.COT_ACT_TERM: return 'Termination of command activation';
            case this.COT_RETREM: return 'Response due to remote command';
            case this.COT_RETLOC: return 'Response due to local command';
            case this.COT_FILE: return 'File access';
            case this.COT_INROGEN: return 'Station interrogation (general)';
            case this.COT_INRO1: return 'Station interrogation for group 1';
            case this.COT_INRO2: return 'Station interrogation for group 2';
            case this.COT_INRO3: return 'Station interrogation for group 3';
            case this.COT_INRO4: return 'Station interrogation for group 4';
            case this.COT_INRO5: return 'Station interrogation for group 5';
            case this.COT_INRO6: return 'Station interrogation for group 6';
            case this.COT_INRO7: return 'Station interrogation for group 7';
            case this.COT_INRO8: return 'Station interrogation for group 8';
            case this.COT_INRO9: return 'Station interrogation for group 9';
            case this.COT_INRO10: return 'Station interrogation for group 10';
            case this.COT_INRO11: return 'Station interrogation for group 11';
            case this.COT_INRO12: return 'Station interrogation for group 12';
            case this.COT_INRO13: return 'Station interrogation for group 13';
            case this.COT_INRO14: return 'Station interrogation for group 14';
            case this.COT_INRO15: return 'Station interrogation for group 15';
            case this.COT_INRO16: return 'Station interrogation for group 16';
            case this.COT_REQCOGEN: return 'Counter interrogation (general)';
            case this.COT_REQCO1: return 'Counter interrogation for group 1';
            case this.COT_REQCO2: return 'Counter interrogation for group 2';
            case this.COT_REQCO3: return 'Counter interrogation for group 3';
            case this.COT_REQCO4: return 'Counter interrogation for group 4';
            case this.COT_UNKNOWN_TYPE: return 'Unknown type';
            case this.COT_UNKNOWN_CAUSE: return 'Unknown cause of transfer';
            case this.COT_UNKNOWN_ASDU_ADDRESS: return 'Unknown common ASDU address';
            case this.COT_UNKNOWN_OBJECT_ADDRESS: return 'Unknown object address';
            case (enumValue >= 14 || enumValue <= 19):
            case (enumValue >= 42 || enumValue <= 43):
            case (enumValue >= 48 || enumValue <= 63):
                return 'Reserved/unused range';
            default:
                throw new Error("无效的传入参数，enumValue应为合法的COT枚举值。");

        }
    }
});

module.exports = {
    UFormatSignalling, CotType
}