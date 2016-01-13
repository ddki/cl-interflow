'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 *
 * process of packing
 *
 * ```
 *
 * in - - - -> out
 *
 * specifically
 *
 *     p1          send         p1`     method        p2            send           p2`
 * in ----> rawIn -----> rawIn ----> in --------> out ----> rawOut ------> rawOut ------> out
 *
 *
 * caller                                       dealer
 * | in                                              |
 * | in -> rawIn                                     |
 * | rawIn        ------------------->         rawIn |
 * |                                     rawIn -> in |
 * |                                       in -> out |
 * |                                   out -> rawOut |
 * | rawOut       <-------------------        rawOut |
 * | rawOut -> out                                   |
 * | out                                             |
 *
 * ```
 *
 * ```
 *
 * packIn::: ins -> rawIn
 *
 * unpackIn::: rawIn -> ins
 *
 * packOut::: out -> rawOut
 *
 * unpackOut::: rawOut -> out
 *
 * method::: ins -> out
 *
 * connect::: rawIn -> rawout
 *
 * flush::: rawOut -> void
 *
 *
 * caller::: (packIn, unpackOut) -> connect -> ins -> out
 *
 * dealer::: (unpackIn, packOut) -> (method) -> (rawIn, flush) -> rawOut
 *
 * ```
 *
 * ```
 *
 * define data processor
 *
 * { packIn, unpackIn, packOut, unpackOut }
 *
 * ```
 */
var caller = function caller() {
    var packIn = arguments.length <= 0 || arguments[0] === undefined ? id : arguments[0];
    var unpackOut = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

    checkFun(packIn, 'packIn');
    checkFun(unpackOut, 'unpackOut');
    return function (connect) {
        checkFun(connect, 'connect');
        return function (ins) {
            return new Promise(function (resolve, reject) {
                var rawIn = packIn(ins);
                // connect may be async
                var rawOut = connect(rawIn);
                if (isPromise(rawOut)) {
                    rawOut.then(function (ret) {
                        resolve(unpackOut(ret));
                    }).catch(function (err) {
                        return reject(err);
                    });
                } else {
                    resolve(unpackOut(rawOut));
                }
            });
        };
    };
};

var dealer = function dealer() {
    var unpackIn = arguments.length <= 0 || arguments[0] === undefined ? id : arguments[0];
    var packOut = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

    checkFun(unpackIn, 'unpackIn');
    checkFun(packOut, 'packOut');
    return function (method) {
        checkFun(method, 'method');
        return function (rawIn, flush) {
            return new Promise(function (resolve, reject) {
                var ins = unpackIn(rawIn);
                // method may be async
                var out = method(ins);

                if (isPromise(out)) {
                    out.then(function (ret) {
                        ret = packOut(ret);
                        flush && flush(ret);
                        resolve(ret);
                    }).catch(function (err) {
                        return reject(err);
                    });
                } else {
                    var ret = packOut(out);
                    flush && flush(ret);
                    resolve(ret);
                }
            });
        };
    };
};

var isPromise = function isPromise(v) {
    return v instanceof Promise || v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';
};

var id = function id(v) {
    return v;
};

var checkFun = function checkFun(v, name) {
    if (!isFunction(v)) throw new TypeError('Expect function for ' + name + '. But got ' + v);
};

var isFunction = function isFunction(v) {
    return typeof v === 'function';
};

module.exports = {
    caller: caller,
    dealer: dealer
};