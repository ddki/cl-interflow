'use strict';

var _index = require('../../index');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

require('babel-polyfill');

describe('processor', function () {
    it('simple interflow', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var methodFinder, del, connect, cal, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        methodFinder = function methodFinder() {
                            return function (a, b) {
                                return a + b;
                            };
                        };

                        del = _index.processor.dealer()(methodFinder);

                        connect = (function () {
                            var _this = this;

                            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(rawIn) {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return del(rawIn);

                                            case 2:
                                                return _context.abrupt('return', _context.sent);

                                            case 3:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function connect(_x) {
                                return ref.apply(this, arguments);
                            };
                        })();

                        cal = _index.processor.caller()(connect);
                        _context2.next = 6;
                        return cal(1, 2);

                    case 6:
                        res = _context2.sent;

                        _assert2.default.equal(res, 3);

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    })));
});