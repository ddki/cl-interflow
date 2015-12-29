'use strict';

var _protocol = require('./protocol');

var _protocol2 = _interopRequireDefault(_protocol);

var _processor = require('./processor');

var _processor2 = _interopRequireDefault(_processor);

var _httpConnect = require('./connect/httpConnect');

var _httpConnect2 = _interopRequireDefault(_httpConnect);

var _httpsConnect = require('./connect/httpsConnect');

var _httpsConnect2 = _interopRequireDefault(_httpsConnect);

var _purePostHttp = require('./processor/purePostHttp');

var _purePostHttp2 = _interopRequireDefault(_purePostHttp);

var _pureGetHttp = require('./processor/pureGetHttp');

var _pureGetHttp2 = _interopRequireDefault(_pureGetHttp);

var _httpReqProcessor = require('./processor/httpReqProcessor');

var _httpReqProcessor2 = _interopRequireDefault(_httpReqProcessor);

var _resFlusher = require('./flusher/resFlusher');

var _resFlusher2 = _interopRequireDefault(_resFlusher);

var _quickPostHttp = require('./quick/quickPostHttp');

var _quickPostHttp2 = _interopRequireDefault(_quickPostHttp);

var _quickGetHttp = require('./quick/quickGetHttp');

var _quickGetHttp2 = _interopRequireDefault(_quickGetHttp);

var _quickHttp = require('./quick/quickHttp');

var _quickHttp2 = _interopRequireDefault(_quickHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    protocol: _protocol2.default,
    Processor: _processor2.default,
    connects: {
        httpConnect: _httpConnect2.default,
        httpsConnect: _httpsConnect2.default
    },
    processors: {
        purePostHttp: _purePostHttp2.default,
        pureGetHttp: _pureGetHttp2.default,
        httpReqProcessor: _httpReqProcessor2.default
    },
    flushers: {
        resFlusher: _resFlusher2.default
    },
    quicks: {
        quickPostHttp: _quickPostHttp2.default,
        quickGetHttp: _quickGetHttp2.default,
        quickHttp: _quickHttp2.default
    }
};