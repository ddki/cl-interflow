'use strict';

var _responser = require('../httpInterflower/responser');

var _responser2 = _interopRequireDefault(_responser);

var _simpleDataProcessor = require('./simpleDataProcessor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (getMethod) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var methodFinder = function methodFinder(rawIn) {
        var apiName = rawIn.body[0];
        return getMethod(apiName, rawIn);
    };

    return (0, _responser2.default)(_simpleDataProcessor.unpackIn, _simpleDataProcessor.packOut, methodFinder, opts);
};