'use strict';

var _protocol = require('./protocol');

var _protocol2 = _interopRequireDefault(_protocol);

var _processor = require('./processor');

var _processor2 = _interopRequireDefault(_processor);

var _httpConnect = require('./connect/httpConnect');

var _httpConnect2 = _interopRequireDefault(_httpConnect);

var _httpsConnect = require('./connect/httpsConnect');

var _httpsConnect2 = _interopRequireDefault(_httpsConnect);

var _httpResponser = require('./responser/httpResponser');

var _httpResponser2 = _interopRequireDefault(_httpResponser);

var _simpleHttp = require('./processor/simpleHttp');

var _simpleHttp2 = _interopRequireDefault(_simpleHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    protocol: _protocol2.default,
    Processor: _processor2.default,
    connects: {
        httpConnect: _httpConnect2.default,
        httpsConnect: _httpsConnect2.default
    },
    responsers: {
        httpResponser: _httpResponser2.default
    },
    processors: {
        simpleHttp: _simpleHttp2.default
    }
};