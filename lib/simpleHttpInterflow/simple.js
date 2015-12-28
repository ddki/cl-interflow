'use strict';

var _processor = require('../processor');

var _processor2 = _interopRequireDefault(_processor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def = function def() {
    var m1 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var m2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    for (var name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};

module.exports = new _processor2.default({
    packIn: function packIn(apiName, options, ins) {
        return {
            options: def({
                headers: {},
                path: '/api',
                method: 'POST'
            }, options),
            body: [apiName, ins]
        };
    },
    unpackIn: function unpackIn(rawIn) {
        return rawIn.body[1];
    },
    packOut: function packOut(out) {
        return {
            body: out
        };
    },
    unpackOut: function unpackOut(rawOut) {
        return rawOut.body;
    }
});