/**
 * @description Extensional method for String to convert string to byte array.
 * The string must split by 1 space and start without prefix "0x".
 * @author Tsccai
 * @date 2023-12-06
 * @returns {Array} return an array made up by UInt8
 * 
 */
String.prototype.toBytes = function () {
    let result = this.split(' ');
    for (let i = 0; i < result.length; i++) {
        result[i] = parseInt(`0x${result[i]}`);
    }
    return result;
}

/**
 * @description Extensional method for Array to read a segment of the byte array.
 * @author Tsccai
 * @date 2023-12-06
 * @param {Number} count The count that will be read, an Integer larger than 0
 * @param {Number} offset Integer. Offset byte count of an byte array, an Integer at least 0, default as 0
 * @returns {Array}
 * @error Throw error when count or offset is invalid.
 */
Array.prototype.readBytes = function (count, offset = 0) {
    if (count <= 0 || offset < 0) {
        throw new Error("非法的传入参数。count应为正整数，offset应为不小于0的整数。");
    }
    if (this.length < count + offset) {
        throw new Error("没有足够的字节供读取");
    }
    return this.slice(offset, count + offset);
}

/**
 * @description Extensional method for Array to convert byte array to UInt. It will always adjust the
 * bit-length automatically.
 * @author Tsccai
 * @date 2023-12-06
 * @param {Boolean} littleEndian Endianness flag, true for Little Endian, false for Big Endian, default as true
 * @returns {Number} Unsigned integer
 */
Array.prototype.toUInt = function (littleEndian = true) {
    if (this.length == 1) {
        return this[0];
    }
    let tmp = [...this];
    if (littleEndian) {
        tmp = tmp.reverse();
    }
    // Method 2
    let value = 0;
    for (let i = 0; i < tmp.length; i++) {
        value = (value << 8) + tmp[i];
    }
    return value;
}

/**
 * @description Extensional method for Array to convert byte array to Int. It will always adjust the
 * bit-length automatically.
 * @author Tsccai
 * @date 2023-12-06
 * @param {Boolean} littleEndian Endianness flag, true for Little Endian, false for Big Endian, default as true
 * @returns {Number} Signed integer
 */
Array.prototype.toInt = function (littleEndian = true) {
    let uint = this.toUInt(littleEndian);
    // support up to 64 bit Integer
    let msb = Math.pow(2, Math.ceil(Math.log2(this.length))) * 8;
    if ((uint & 1 << (msb - 1)) > 0) {
        return -1 * ((1 << msb) - uint);
    }
    else {
        return uint;
    }
}

/**
 * @description Extensional method for Array to convert byte array to 32 bit Float.
 * @author Tsccai
 * @date 2023-12-06
 * @param {Boolean} littleEndian Endianness flag, true for Little Endian, false for Big Endian, default as true
 * @returns {Number} 32 bit Float
 */
Array.prototype.toFloat = function (littleEndian = true) {
    let arr = new Uint8Array(this);
    let dataView = new DataView(arr.buffer);
    return dataView.getFloat32(0, littleEndian);
}