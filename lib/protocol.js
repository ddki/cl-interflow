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
 * | out
 * ```
 *
 * ```
 *
 * packIn::: ins -> rawIn
 *
 * unpackIn::: rawIn -> [ins]
 *
 * packOut::: out -> rawOut
 *
 * unpackOut::: rawOut -> out
 *
 * methodFinder::: rawIn -> method
 *
 * method::: ...ins -> out
 *
 * connect::: rawIn -> rawout
 *
 *
 * caller::: (packIn, unpackOut) -> connect -> ...ins -> out
 *
 * dealer::: (unpackIn, packOut) -> (methodFinder) -> rawIn -> rawOut
 *
 * ```
 *
 */
var caller = function caller() {
    var packIn = arguments.length <= 0 || arguments[0] === undefined ? id : arguments[0];
    var unpackOut = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];

    checkFun(packIn, 'packIn');
    checkFun(unpackOut, 'unpackOut');
    return function (connect) {
        checkFun(connect, 'connect');
        return function () {
            for (var _len = arguments.length, ins = Array(_len), _key = 0; _key < _len; _key++) {
                ins[_key] = arguments[_key];
            }

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
    return function (methodFinder) {
        checkFun(methodFinder, 'methodFinder');
        return function (rawIn) {
            return new Promise(function (resolve, reject) {
                // find the right method to deal with in
                var method = methodFinder(rawIn);
                var ins = unpackIn(rawIn);
                // in dealing method may be async
                var out = method.apply(undefined, ins);

                if (isPromise(out)) {
                    out.then(function (ret) {
                        resolve(ret);
                    }).catch(function (err) {
                        return reject(err);
                    });
                } else {
                    resolve(packOut(out));
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