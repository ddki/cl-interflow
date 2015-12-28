"use strict";

var Processor = function Processor(_ref) {
    var packIn = _ref.packIn;
    var unpackIn = _ref.unpackIn;
    var packOut = _ref.packOut;
    var unpackOut = _ref.unpackOut;

    this.packIn = packIn;
    this.unpackIn = unpackIn;
    this.packOut = packOut;
    this.unpackOut = unpackOut;
};

Processor.prototype = {
    constructor: Processor,
    getPackIn: function getPackIn() {
        return this.packIn;
    },
    getUnpackIn: function getUnpackIn() {
        return this.unpackIn;
    },
    getPackOut: function getPackOut() {
        return this.packOut;
    },
    getUnpackOut: function getUnpackOut() {
        return this.unpackOut;
    },
    compose: function compose(processor) {
        // TODO
    }
};

module.exports = Processor;