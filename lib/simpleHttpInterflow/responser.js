'use strict';

var _responser = require('../httpInterflower/responser');

var _responser2 = _interopRequireDefault(_responser);

var _simple = require('./simple');

var _simple2 = _interopRequireDefault(_simple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_simple2.default.getUnpackIn);

module.exports = function (getMethod) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var methodFinder = function methodFinder(rawIn) {
        var apiName = rawIn.body[0];
        return getMethod(apiName, rawIn);
    };

    return (0, _responser2.default)(_simple2.default.getUnpackIn(), _simple2.default.getPackOut(), methodFinder, opts);
};