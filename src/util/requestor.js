import http from 'http';
import https from 'https';

module.exports = (type, opts = {}) => {
    let sender = http;
    let { chunkHandler, throwBody, optionsWraper, bodyParser } = opts;

    if (type === 'https') {
        sender = https;
    }
    return (options = {}, postData = '') => {
        if(optionsWraper)
            options = optionsWraper(options);

        if(chunkHandler && typeof chunkHandler !== 'function') {
            throw new TypeError('Expect null or function, but got ' + chunkHandler);
        }
        return new Promise((resolve, reject) => {
            let req = sender.request(options, (res) => {
                let chunks = [];
                let headers = res.headers;
                res.on('data', function (chunk) {
                    chunkHandler && chunkHandler(chunk, 'data');
                    if (!throwBody) {
                        chunks.push(chunk);
                    }
                });
                res.on('end', function () {
                    chunkHandler && chunkHandler(null, 'end');
                    let body = chunks.join('');
                    if(bodyParser)
                        body = bodyParser(body);
                    resolve({
                        headers,
                        body
                    });
                });
            });
            req.on('error', function (e) {
                reject(e);
            });
            // write data to request body
            req.write(postData);
            req.end();
        });
    };
};