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
let caller = (packIn = id, unpackOut = id) => {
    checkFun(packIn, 'packIn');
    checkFun(unpackOut, 'unpackOut');
    return (connect) => {
        checkFun(connect, 'connect');
        return (ins) => new Promise((resolve, reject) => {
            let rawIn = packIn(ins);
            // connect may be async
            let rawOut = connect(rawIn);
            if(isPromise(rawOut)) {
                rawOut.then(ret => {
                    resolve(unpackOut(ret));
                }).catch(err => reject(err));
            } else {
                resolve(unpackOut(rawOut));
            }
        });
    };
};

let dealer = (unpackIn = id, packOut = id) => {
    checkFun(unpackIn, 'unpackIn');
    checkFun(packOut, 'packOut');
    return (method) => {
        checkFun(method, 'method');
        return (rawIn, flush) => new Promise((resolve, reject) => {
            let ins = unpackIn(rawIn);
            // method may be async
            let out = method(ins, rawIn);

            if(isPromise(out)) {
                out.then((ret) => {
                    ret = packOut(ret);
                    flush && flush(ret);
                    resolve(ret);
                }).catch(err => reject(err));
            } else {
                let ret = packOut(out);
                flush && flush(ret);
                resolve(ret);
            }
        });
    };
};

let isPromise = (v) => v instanceof Promise ||
    (v && typeof v === 'object' && typeof v.then === 'function'
        && typeof v.catch === 'function');

let id = v => v;

let checkFun = (v, name) => {
    if(!isFunction(v))
        throw new TypeError(`Expect function for ${name}. But got ${v}`);
};

let isFunction = v => typeof v === 'function';

module.exports = {
    caller,
    dealer
};
