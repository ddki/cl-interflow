import requestor from 'cl-requestor';
import Processor from '../processor';

let idProcessor = new Processor();

let stdLowProcessor = new Processor({
    unpackIn: ({req, body}) => {
        let rawIn = {
            options: {
                path: req.url,
                method: req.method,
                headers: req.headers
            },
            body
        };
        return rawIn;
    }
});

/**
 * rawOut = {
 *     headers,
 *     body
 * }
 */
let stdLowFlusher = (res) => (rawOut) => {
    if(rawOut.headers) {
        res.writeHead(200, rawOut.headers);
    }
    //
    res.end(rawOut.body);
};

let stdMidderWrapper = (processor, method) => {
    
};

/**
 * opts = {
 *     type : http | https,
 *     processor
 * }
 */
module.exports = (opts = {}) => {
    let processor = opts.processor || idProcessor;

    // pack the low processor
    processor = processor.pack(stdLowProcessor);

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

    return {
        caller
    };
};