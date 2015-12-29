/**
 * packOut out -> rawOut
 *
 * rawIn = {options, body}
 * rawOut = {headers, body}
 */
module.exports = (processor, methodFinder, opts = {}) => {
    let response = processor.getDealer(methodFinder);

    return (req, res, body) => {
        body = body ? JSON.parse(body + '') : '';
        let rawIn = {
            options: {
                url: req.url,
                method: req.method,
                headers: req.headers
            },
            body: body
        };

        let flush = (rawOut) => {
            if(opts.output) {
                let outBody = rawOut.body ? JSON.stringify(rawOut.body) : '';
                let outHeaders = rawOut.headers;
                if(outBody.headers) {
                    res.writeHeade(200, outHeaders);
                }
                //
                res.end(outBody);
            }
        };

        response(rawIn, flush);
    };
};