'use strict';

var _simpleRule = require('./simpleRule');

var _simpleRule2 = _interopRequireDefault(_simpleRule);

var _requestor = require('../util/requestor');

var _requestor2 = _interopRequireDefault(_requestor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (options) {
    var request = (0, _requestor2.default)('http', {
        bodyParser: function bodyParser(body) {
            return JSON.parse(body);
        }
    });

    var connect = function connect(rawIn) {
        return new Promise(function (resolve, reject) {
            request(rawIn.options, JSON.stringify(rawIn.body)).then(function (rawOut) {
                resolve(rawOut);
            }).catch(function (err) {
                return reject(err);
            });
        });
    };

    return _simpleRule2.default.requestor(connect, {
        optionsWraper: function optionsWraper(ops) {
            return def(ops, options);
        }
    });
};

var def = function def() {
    var m1 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var m2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    for (var name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};