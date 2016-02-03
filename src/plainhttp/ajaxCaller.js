/**
 * this module is provided to browser
 */

import browserRequestor from '../util/browserRequestor';
import getProcessor from './getProcessor';
import processors from './processors';

let wrapValue = v => {
    if (isPromise(v)) {
        return v;
    } else {
        return Promise.resolve(v);
    }
};

let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function';

let getCaller = (processor, connect) => {
    let {packIn, unpackOut} = processor;
    return (ins) => new Promise ((resolve, reject) => {
        let rawIns = packIn(ins);
        let rawout = connect(rawIns);
        rawout = wrapValue(rawout);
        rawout.then(rawoutv => {
            let out = unpackOut(rawoutv);
            resolve(out);
        }).catch(err => reject(err));
    });
};

/**
 * opts = {
 *     processor,
 *     lowProcessor
 * }
 *
 * processor = new Processor({ packIn, unpackIn, packOut, unPackout })
 *
 * lowProcessor = new Processor({ packIn, unpackIn, packOut, unPackout })
 */
let plainhttp = (opts = {}) => {
    let processor = getProcessor(opts);
    //
    let request = browserRequestor(opts);

    /**
     * rawIn = {
     *     options,
     *     body
     * }
     */
    let connect = (rawIn) => request(rawIn.options, rawIn.body);

    // get caller
    let caller = getCaller(processor, connect);

    return {
        caller
    };
};

plainhttp.processors = processors;

module.exports = plainhttp;
