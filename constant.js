const START_BYTE = 0x68;
const LEN_START_BYTE = 1;
const LEN_APDU_LENGTH = 1;
const LEN_CF = 4;
const MASK_CF = 4 - 1;
const LEN_ASDU_TYPE = 1;
const LEN_NUM_OF_OBJECT = 1;
const MASK_NUM_OF_OBJECT = 0xFF >> 1;

const MASK_COT = 0xFF >> 2;

module.exports = {
    START_BYTE,LEN_START_BYTE, LEN_APDU_LENGTH,
    LEN_CF, MASK_CF,
    LEN_ASDU_TYPE,
    LEN_NUM_OF_OBJECT, MASK_NUM_OF_OBJECT,
    MASK_COT
}