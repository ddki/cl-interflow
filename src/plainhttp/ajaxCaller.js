/**
 * this module is provided to browser
 */

import browserRequestor from '../util/browserRequestor';
import getProcessor from './getProcessor';
import processors from './processors';

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
    let caller = processor.getCaller(connect);

    return {
        caller
    };
};

plainhttp.processors = processors;

export default plainhttp;