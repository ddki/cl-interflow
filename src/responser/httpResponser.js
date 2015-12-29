import Processor from '../processor';

let lowProcessor = new Processor({
    packIn: v => v,
    unpackIn: ({req, body}) => {
        body = body ? JSON.parse(body + '') : '';
        let rawIn = {
            options: {
                url: req.url,
                method: req.method,
                headers: req.headers
            },
            body
        };
        return rawIn;
    }
});

/**
 * packOut out -> rawOut
 *
 * rawOut = {headers, body}
 */
module.exports = (processor, methodFinder, opts = {}) => {
    processor = processor.pack(lowProcessor);
    let response = processor.getDealer(methodFinder);

    return (req, res, body) => {
        let flush = (rawOut) => {
            if(opts.output) {
                let outBody = rawOut.body ? JSON.stringify(rawOut.body) : '';
                let outHeaders = rawOut.headers;
                if(outBody.headers) {
                    res.writeHead(200, outHeaders);
                }
                //
                res.end(outBody);
            }
        };

        response({req, body}, flush);
    };
};