'use strict';

var _protocol = require('../protocol');

var _protocol2 = _interopRequireDefault(_protocol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = function id(v) {
    return v;
};

var requestor = function requestor(connect, opts) {
    return function (apiName) {
        opts.optionsWraper = opts.optionsWraper || id;
        var packIn = function packIn(ins) {
            var options = opts.optionsWraper({
                headers: {},
                path: '/api',
                method: 'POST'
            });
            var body = [apiName, ins];
            return {
                options: options,
                body: body
            };
        };

        return _protocol2.default.caller(packIn, unpackOut)(connect);
    };
};

var unpackOut = function unpackOut(rawOut) {
    return rawOut.body;
};

var unpackIn = function unpackIn(rawIn) {
    return rawIn.body[1];
};

var packOut = function packOut(out) {
    return {
        body: out
    };
};

var responser = function responser(methodFinder) {
    return _protocol2.default.dealer(unpackIn, packOut)(methodFinder);
};

module.exports = {
    requestor: requestor,
    responser: responser
};