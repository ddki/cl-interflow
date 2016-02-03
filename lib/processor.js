"use strict";

var id = function id(v) {
    return v;
};

var Processor = function Processor() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var packIn = _ref.packIn;
    var unpackIn = _ref.unpackIn;
    var packOut = _ref.packOut;
    var unpackOut = _ref.unpackOut;

    this.packIn = packIn || id;
    this.unpackIn = unpackIn || id;
    this.packOut = packOut || id;
    this.unpackOut = unpackOut || id;
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
    // the way to compose processor
    pack: function pack(processor) {
        var packIn = compose(processor.getPackIn(), this.getPackIn());
        var unpackIn = compose(this.getUnpackIn(), processor.getUnpackIn());

        var packOut = compose(processor.getPackOut(), this.getPackOut());
        var unpackOut = compose(this.getUnpackOut(), processor.getUnpackOut());

        return new Processor({
            packIn: packIn,
            unpackIn: unpackIn,
            packOut: packOut,
            unpackOut: unpackOut
        });
    }
};

var compose = function compose(f1, f2) {
    return function () {
        for (var _len = arguments.length, xs = Array(_len), _key = 0; _key < _len; _key++) {
            xs[_key] = arguments[_key];
        }

        return f1(f2.apply(undefined, xs));
    };
};

module.exports = Processor;