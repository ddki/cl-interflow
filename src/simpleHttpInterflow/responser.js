import simpleRule from './simpleRule';

module.exports = (getMethod, opts={}) => {
    let methodFinder = (rawIn) => {
        let apiName = rawIn.body[0];
        return getMethod(apiName, rawIn);
    };

    let response = simpleRule.responser(methodFinder);

    return (req, res, body) => new Promise((resolve, reject) => {
        body = JSON.parse(body + '');
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
                res.end(JSON.stringify(rawOut.body));
            }
        }).catch(err => reject(err));
    });
};