'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _requestorServer = require('../../lib/simpleHttpInterflow/requestor-server');

var _requestorServer2 = _interopRequireDefault(_requestorServer);

var _responser = require('../../lib/simpleHttpInterflow/responser');

var _responser2 = _interopRequireDefault(_responser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

require('babel-polyfill');

describe('simple http interflow', function () {
    it('simple interflow', function (done) {
        var methodMap = {
            'add': function add(a, b) {
                return a + b;
            }
        };

        var midGen = (0, _responser2.default)(function (apiName) {
            return methodMap[apiName];
        }, {
            output: true
        });

        var server = _http2.default.createServer(function (req, res) {
            var chunks = [];
            req.on('data', function (chunk) {
                chunks.push(chunk);
            });

            req.on('end', function () {
                var body = chunks.join('');
                midGen(req, res, body);
            });
        });

        server.listen(0, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            var port, request, ret;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            port = server.address().port;
                            request = (0, _requestorServer2.default)({
                                hostname: '127.0.0.1',
                                port: port
                            });
                            _context.next = 4;
                            return request('add')(1, 2);

                        case 4:
                            ret = _context.sent;

                            _assert2.default.equal(ret, 3);
                            done();

                        case 7:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        })));
    });
});