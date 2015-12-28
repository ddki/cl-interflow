'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (type) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var sender = _http2.default;
    var chunkHandler = opts.chunkHandler;
    var throwBody = opts.throwBody;
    var optionsWraper = opts.optionsWraper;
    var bodyParser = opts.bodyParser;

    if (type === 'https') {
        sender = _https2.default;
    }
    return function () {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var postData = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        if (optionsWraper) options = optionsWraper(options);

        if (chunkHandler && typeof chunkHandler !== 'function') {
            throw new TypeError('Expect null or function, but got ' + chunkHandler);
        }
        return new Promise(function (resolve, reject) {
            var req = sender.request(options, function (res) {
                var chunks = [];
                var headers = res.headers;
                res.on('data', function (chunk) {
                    chunkHandler && chunkHandler(chunk, 'data');
                    if (!throwBody) {
                        chunks.push(chunk);
                    }
                });
                res.on('end', function () {
                    chunkHandler && chunkHandler(null, 'end');
                    var body = chunks.join('');
                    if (bodyParser) body = bodyParser(body);
                    resolve({
                        headers: headers,
                        body: body
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