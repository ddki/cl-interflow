let Processor = function ({ packIn, unpackIn, packOut, unpackOut }) {
    this.packIn = packIn;
    this.unpackIn = unpackIn;
    this.packOut = packOut;
    this.unpackOut = unpackOut;
};

Processor.prototype = {
    constructor: Processor,
    getPackIn: function () {
        return this.packIn;
    },
    getUnpackIn: function () {
        return this.unpackIn;
    },
    getPackOut: function () {
        return this.packOut;
    },
    getUnpackOut: function () {
        return this.unpackOut;
    },
    compose: function (processor) {
        // TODO
    }
};

module.exports = Processor;