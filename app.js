const Iec104Packet = require('./Iec104Packet');

//const input=[104,267,321,22];     // Invalid Packet
const input = "68 34 5A 14 7C 00 0B 07 03 00 0C 00 10 30 00 BE 09 00 11 30 00 90 09 00 0E 30 00 75 00 00 28 30 00 25 09 00 29 30 00 75 00 00 0F 30 00 0F 0A 00 2E 30 00 AE 05 00"     // I-Format
// const input = "68 04 01 00 02 00";  // S-Format
//const input = '68 04 83 00 00 00';    // U-Format


try {
    const packet = new Iec104Packet(input.toBytes(), { cotLength: 2, asduAddrLength: 2, ioAddrLength: 3 });

    // packet.ApduLength = 2333;
    // console.log(`Length: ${packet.ApduLength}`);

    // packet.FrameFormat = "HHH";
    // console.log(packet.FrameFormat);

    // packet.ControlField = {};
    // console.log(packet.ControlField);

    // packet.Asdu = { dog: "Spike" }
    // console.log(packet.Asdu);
    console.log(packet.toString())


}
catch (err) {
    console.error(err);
}

