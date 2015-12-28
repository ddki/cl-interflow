'use strict';

var _protocol = require('../protocol');

var _protocol2 = _interopRequireDefault(_protocol);

var _requestor = require('../util/requestor');

var _requestor2 = _interopRequireDefault(_requestor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * packIn::: ins -> rawIn
 *
 * rawIn = {options, body}
 */

module.exports = function (packIn, unpackOut) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var request = (0, _requestor2.default)(options.protocol || 'http', {
        bodyParser: function bodyParser(body) {
            return JSON.parse(body);
        }
    });

    var connect = function connect(rawIn) {
        return new Promise(function (resolve, reject) {
            var postData = '';
            if (rawIn.body) postData = JSON.stringify(rawIn.body);
            request(rawIn.options, postData).then(function (rawOut) {
                resolve(rawOut);
            }).catch(function (err) {
                return reject(err);
            });
        });
    };

    return _protocol2.default.caller(packIn, unpackOut)(connect);
};