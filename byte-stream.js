class ByteStream {
    #buffer = [];
    #ptr = 0;

    get Length() { return this.#buffer.length; }
    get CurrentPointer() { return this.#ptr; }
    get IsEndOfStream() { return this.#ptr >= this.#buffer.length; }

    constructor(bytes) {
        this.#buffer = bytes;

    }

    Read(length) {
        if (this.#ptr + length > this.#buffer.length) {
            throw new Error('Out of stream');
        }
        const result = this.#buffer.readBytes(length, this.#ptr);
        this.#ptr += length;
        return result;
    }


    Reset() {
        this.#ptr = 0;
    }

    Close() {
        this.#buffer = [];
        this.#ptr = 0;
    }

}
module.exports = ByteStream;