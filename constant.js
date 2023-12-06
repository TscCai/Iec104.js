// Start byte of IEC-60870-5-104 packet
const START_BYTE = 0x68;

// Byte length of field "Start Byte" in packet
const LEN_START_BYTE = 1;

// Byte length of field "APDU Length" in packet
const LEN_APDU_LENGTH = 1;

// Byte length of field "Control Filed" in packet
const LEN_CF = 4;

// Mask of Control Filed in packet
const MASK_CF = 4 - 1;

// Byte length of field "ASDU Type" in packet
const LEN_ASDU_TYPE = 1;

// Byte length of field "Number of Object" in packet
const LEN_NUM_OF_OBJECT = 1;

// Mask of "Control Filed" in packet
const MASK_NUM_OF_OBJECT = 0xFF >> 1;

// Mask of "Cause of Transfer" in packet
const MASK_COT = 0xFF >> 2;

module.exports = {
    START_BYTE, LEN_START_BYTE, LEN_APDU_LENGTH,
    LEN_CF, MASK_CF,
    LEN_ASDU_TYPE,
    LEN_NUM_OF_OBJECT, MASK_NUM_OF_OBJECT,
    MASK_COT
}