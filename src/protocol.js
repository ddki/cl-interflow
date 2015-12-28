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
let caller = (packIn = id, unpackOut = id) => {
    checkFun(packIn, 'packIn');
    checkFun(unpackOut, 'unpackOut');
    return (connect) => {
        checkFun(connect, 'connect');
        return (...ins) => new Promise((resolve, reject)=>{
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
    return (methodFinder) => {
        checkFun(methodFinder, 'methodFinder');
        return (rawIn) => new Promise((resolve, reject) => {
            // find the right method to deal with in
            let method = methodFinder(rawIn);
            let ins = unpackIn(rawIn);
            // in dealing method may be async
            let out = method.apply(undefined, ins);

            if(isPromise(out)) {
                out.then((ret) => {
                    resolve(ret);
                }).catch(err => reject(err));
            } else {
                resolve(packOut(out));
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