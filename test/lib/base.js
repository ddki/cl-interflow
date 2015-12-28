'use strict';

var _index = require('../../index');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

require('babel-polyfill');

describe('protocol', function () {
    it('simple interflow', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var methodFinder, del, connect, cal, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        methodFinder = function methodFinder() {
                            return function (a, b) {
                                return a + b;
                            };
                        };

                        del = _index.protocol.dealer()(methodFinder);
                        connect = del;
                        cal = _index.protocol.caller()(connect);
                        _context.next = 6;
                        return cal(1, 2);

                    case 6:
                        res = _context.sent;

                        _assert2.default.equal(res, 3);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    })));

    it('map function', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var methodMap, unpackIn, packOut, methodFinder, deal, callGen, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        methodMap = {
                            'add': function add(a, b) {
                                return a + b;
                            }
                        };

                        unpackIn = function unpackIn(v) {
                            return v[1];
                        };

                        packOut = function packOut(v) {
                            return v;
                        };

                        methodFinder = function methodFinder(rawIn) {
                            return methodMap[rawIn[0]];
                        };

                        deal = _index.protocol.dealer(unpackIn, packOut)(methodFinder);

                        callGen = function callGen(type) {
                            var packIn = function packIn(ins) {
                                return [type, ins];
                            };
                            var unpackOut = function unpackOut(v) {
                                return v;
                            };

                            var connect = deal;

                            var call = _index.protocol.caller(packIn, unpackOut)(connect);
                            return call;
                        };

                        _context2.next = 8;
                        return callGen('add')(1, 2);

                    case 8:
                        res = _context2.sent;

                        _assert2.default.equal(res, 3);

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    })));
});