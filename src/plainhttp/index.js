import requestor from 'cl-requestor';
import getProcessor from './getProcessor';
import processors from './processors';

/**
 * rawOut = {
 *     headers,
 *     body
 * }
 */
let stdFlusher = (res) => (out) => {
    if (out.headers) {
        res.writeHead(200, out.headers);
    }
    //
    res.end(out.body);
};

let stdMidForm = (dealer, flusher) => (req, res, body) => dealer({
    req, body
}, flusher(res));

/**
 * opts = {
 *     type : http | https,
 *     processor,
 *     flusher, // define how to response data
 *     midForm, // define middleware form
 *     lowProcessor
 * }
 *
 * processor = new Processor({ packIn, unpackIn, packOut, unPackout })
 *
 * lowProcessor = new Processor({ packIn, unpackIn, packOut, unPackout })
 *
 * flusher::: (...) -> rawOut -> ...
 *
 * midForm::: (dealer, flusher) -> (...) -> ...
 */
let plainhttp = (opts = {}) => {
    let flusher = opts.flusher || stdFlusher;
    let midForm = opts.midFrom || stdMidForm;
    let processor = getProcessor(opts);
    //
    let request = requestor(opts.type);

    /**
     * rawIn = {
     *     options,
     *     body
     * }
     */
    let connect = (rawIn) => request(rawIn.options, rawIn.body);

    // get caller
    let caller = processor.getCaller(connect);

    // builde mider
    let mider = (method) => {
        let dealer = processor.getDealer(method);
        return midForm(dealer, flusher);
    };

    return {
        caller,
        mider
    };
};

plainhttp.processors = processors;

export default plainhttp;