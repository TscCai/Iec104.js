const Enums = require('./enum');
Array.prototype.readBytes = function (count, offset = 0) {
    if (count < 0 || offset < 0) {
        throw new Error("count和offset应为正整数");
    }
    if (this.length < count + offset) {
        throw new Error("没有足够的字节供读取");
    }
    return this.slice(offset, count + offset);
}
// 将数组转换为无符号整型
Array.prototype.toUInt = function (endianness = Enums.Endianness.Little) {
    if (this.length == 1) {
        return this[0];
    }
    let tmp = [...this];
    if (endianness == Enums.Endianness.Little) {
        tmp = tmp.reverse();
    }
    // Method 2
    let value = 0;
    for (let i = 0; i < tmp.length; i++) {
        value = (value << 8) + tmp[i];
       // value += tmp[i];
    }
    return value;
}

Array.prototype.toInt = function () {

}

String.prototype.toBytes = function () {
    let result = this.split(' ');
    for (let i = 0; i < result.length; i++) {
        result[i] = parseInt(`0x${result[i]}`);
    }
    return result;
}