'use strict';

var _protocol = require('./protocol');

var _protocol2 = _interopRequireDefault(_protocol);

var _processor = require('./processor');

var _processor2 = _interopRequireDefault(_processor);

var _httpConnect = require('./connect/httpConnect');

var _httpConnect2 = _interopRequireDefault(_httpConnect);

var _httpsConnect = require('./connect/httpsConnect');

var _httpsConnect2 = _interopRequireDefault(_httpsConnect);

var _simpleHttp = require('./processor/simpleHttp');

var _simpleHttp2 = _interopRequireDefault(_simpleHttp);

var _httpReqProcessor = require('./processor/httpReqProcessor');

var _httpReqProcessor2 = _interopRequireDefault(_httpReqProcessor);

var _resFlusher = require('./flusher/resFlusher');

var _resFlusher2 = _interopRequireDefault(_resFlusher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    protocol: _protocol2.default,
    Processor: _processor2.default,
    connects: {
        httpConnect: _httpConnect2.default,
        httpsConnect: _httpsConnect2.default
    },
    processors: {
        simpleHttp: _simpleHttp2.default,
        httpReqProcessor: _httpReqProcessor2.default
    },
    flushers: {
        resFlusher: _resFlusher2.default
    }
};