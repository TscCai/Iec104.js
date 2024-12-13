const Iec104Packet = require('./Iec104Packet');

//const input=[104,267,321,22];     // Invalid Packet
// I-Format integer
// const input = "68 34 5A 14 7C 00 0B 07 03 00 0C 00 10 30 00 BE 09 00 11 30 00 90 09 00 0E 30 00 75 00 00 28 30 00 25 09 00 29 30 00 75 00 00 0F 30 00 0F 0A 00 2E 30 00 AE 05 00"     // I-Format

// I-Format float
// const input = '68 12 BC 6C 22 02 0D 01 03 00 0B 00 AB 41 00 CD CC 83 43 00';

// I-Format remote control
// const input ='68 0E 64 03 8A F4 2D 01 06 01 0B 00 1B 60 00 81';
//const input = '680e000000002d01060116000e600001'
const input = '680e000002002d0147 00 16000e600001'

// const input = "68 04 01 00 02 00";  // S-Format
//const input = '68 04 83 00 00 00';    // U-Format


try {
    const packet = new Iec104Packet(input.toBytes(), { cotLength: 2, asduAddrLength: 2, ioAddrLength: 3 });
    console.log('Raw Hex: '+packet.RawBytes.toHex())
    console.log(packet.toString())
  

}
catch (err) {
    console.error(err);
}

