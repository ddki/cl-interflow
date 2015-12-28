'use strict';

var _simpleRule = require('./simpleRule');

var _simpleRule2 = _interopRequireDefault(_simpleRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (getMethod) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var methodFinder = function methodFinder(rawIn) {
        var apiName = rawIn.body[0];
        return getMethod(apiName, rawIn);
    };

    var response = _simpleRule2.default.responser(methodFinder);

    return function (req, res, body) {
        return new Promise(function (resolve, reject) {
            body = JSON.parse(body + '');
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
                    res.end(JSON.stringify(rawOut.body));
                }
            }).catch(function (err) {
                return reject(err);
            });
        });
    };
};