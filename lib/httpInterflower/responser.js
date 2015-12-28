'use strict';

var _protocol = require('../protocol');

var _protocol2 = _interopRequireDefault(_protocol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * packOut out -> rawOut
 *
 * rawOut = {options, body}
 */
module.exports = function (unpackIn, packOut, methodFinder) {
    var opts = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var response = _protocol2.default.dealer(unpackIn, packOut)(methodFinder);

    return function (req, res, body) {
        return new Promise(function (resolve, reject) {
            body = body ? JSON.parse(body + '') : '';
            var rawIn = {
                options: {
                    url: req.url,
                    method: req.method,
                    headers: req.headers
                },
                body: body
            };

            response(rawIn).then(function (rawOut) {
                resolve(rawOut);
                if (opts.output) {
                    var outBody = rawOut.body ? JSON.stringify(rawOut.body) : '';
                    res.end(outBody);
                }
            }).catch(function (err) {
                return reject(err);
            });
        });
    };
};