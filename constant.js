const START_BYTE = 0x68;
const LEN_START_BYTE = 1;
const LEN_APDU_LENGTH = 1;
const LEN_CF = 4;
const CF_MASK = 4 - 1;

module.exports = { START_BYTE, LEN_APDU_LENGTH, LEN_START_BYTE, LEN_CF, CF_MASK }