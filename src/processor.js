import protocol from './protocol';

let id = v => v;

let Processor = function ({ packIn, unpackIn, packOut, unpackOut }) {
    this.packIn = packIn || id;
    this.unpackIn = unpackIn || id;
    this.packOut = packOut || id;
    this.unpackOut = unpackOut || id;
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
    getCaller: function (connect) {
        return protocol.caller(this.getPackIn(), this.getUnpackOut())(connect);
    },
    getDealer: function (methodFinder) {
        return protocol.dealer(this.getUnpackIn(), this.getPackOut())(methodFinder);
    },
    // the way to compose processor
    pack: function (processor) {
        let packIn = compose(processor.getPackIn(), this.getPackIn());
        let unpackIn = compose(this.getUnpackIn(), processor.getUnpackIn());

        let packOut = compose(processor.getPackOut(), this.getPackOut());
        let unpackOut = compose(this.getUnpackOut(), processor.getUnpackOut());

        return new Processor({
            packIn,
            unpackIn,
            packOut,
            unpackOut
        });
    }
};

let compose = (f1, f2) => (...xs) => f1(f2.apply(undefined, xs));

module.exports = Processor;