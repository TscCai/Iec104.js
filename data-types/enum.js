const DPI = Object.freeze({
    NotSureOrMidState: 0x00,
    Open: 0x01,
    Closed: 0x02,
    NotSure: 0x03,
    toString(enumValue) {
        switch (enumValue) {
            case this.Open: return "Open";
            case this.Closed: return "Close";
            case this.NotSure: return "Not Sure(double closed)";
            case this.NotSureOrMidState: return "Not Sure Or Middle State(double open)";
        }
    }
});
module.exports = { DPI };
