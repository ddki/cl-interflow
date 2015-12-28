import protocol from '../protocol';

/**
 * packOut out -> rawOut
 *
 * rawOut = {options, body}
 */
module.exports = (unpackIn, packOut, methodFinder, opts = {}) =>{
    let response = protocol.dealer(unpackIn, packOut)(methodFinder);

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
            resolve(rawOut);
            if(opts.output) {
                let outBody = rawOut.body ? JSON.stringify(rawOut.body) : '';
                res.end(outBody);
            }
        }).catch(err => reject(err));
    });
};