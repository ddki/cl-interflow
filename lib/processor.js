'use strict';

var _protocol = require('./protocol');

var _protocol2 = _interopRequireDefault(_protocol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    getCaller: function getCaller() {
        return _protocol2.default.caller(this.getPackIn(), this.getUnpackOut());
    },
    getDealer: function getDealer() {
        return _protocol2.default.dealer(this.getUnpackIn(), this.getPackOut());
    },
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