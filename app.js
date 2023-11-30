const Iec104Packet = require('./Iec104Packet');

//const input=[104,267,321,22];     // Invalid Packet
const input = "68 0E 6C 00 78 12 64 01 06 00 01 00 00 00 00 14"     // I-Format
// const input = "68 04 01 00 02 00";  // S-Format
//const input = '68 04 83 00 00 00';    // U-Format
try {
    const p = new Iec104Packet(input.toBytes());

    p.APDULength = 2333;
    console.log(p.APDULength);

    p.FrameFormat = "HHH";
    console.log(p.FrameFormat);

    p.ControlField = {};
    console.log(p.ControlField);
}
catch (err) {
    console.error(err);

}

