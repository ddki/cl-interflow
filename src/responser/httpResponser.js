/**
 * packOut out -> rawOut
 *
 * rawIn = {options, body}
 * rawOut = {headers, body}
 */
module.exports = (processor, methodFinder, opts = {}) => {
    let response = processor.getDealer()(methodFinder);

    return (req, res, body) => new Promise((resolve, reject) => {
        body = body ? JSON.parse(body + '') : '';
        let rawIn = {
            options: {
                url: req.url,
                method: req.method,
                headers: req.headers
            },
            body: body
        };

        response(rawIn).then(rawOut => {
            if(opts.output) {
                let outBody = rawOut.body ? JSON.stringify(rawOut.body) : '';
                let outHeaders = outBody.headers;
                if(outBody.headers) {
                    res.writeHeade(200, outHeaders);
                }
                //
                res.end(outBody);
            }
            resolve(rawOut);
        }).catch(err => reject(err));
    });
};