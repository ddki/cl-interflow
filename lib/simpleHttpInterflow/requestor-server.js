'use strict';

var _requestorServer = require('../httpInterflower/requestor-server');

var _requestorServer2 = _interopRequireDefault(_requestorServer);

var _simpleRule = require('./simpleRule');

var _simpleRule2 = _interopRequireDefault(_simpleRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return function (apiName) {
        return function () {
            for (var _len = arguments.length, ins = Array(_len), _key = 0; _key < _len; _key++) {
                ins[_key] = arguments[_key];
            }

            return (0, _requestorServer2.default)(_simpleRule2.default.packIn, _simpleRule2.default.unpackOut, options)(apiName, options, ins);
        };
    };
};