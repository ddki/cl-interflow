import querystring from 'querystring';
import URL from 'url';
import Processor from '../processor';

const queryName = '__data';

let def = (m1 = {}, m2 = {}) => {
    for (let name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};

let out = {
    packOut: (out) => {
        return {
            body: JSON.stringify(out),
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            }
        };
    },
    unpackOut: (rawOut) => JSON.parse(rawOut.body)
};

/**
 * caller (options, apiName, ins) -> out
 */
let rcGet = {
    packIn: ({
        options,
        apiName,
        ins
    } = {}) => {
        let opts = def({
            headers: {},
            path: '/api',
            method: 'GET'
        }, options);
        let query = queryName + '=' + JSON.stringify([apiName, ins]);
        opts.path = opts.path.indexOf('?') === -1 ?
        (opts.path + '?' + query) :
            (opts.path + '&' + query);
        return {
            options: opts
        };
    },
    unpackIn: (rawIn) => {
        let url = rawIn.options.path;
        let query = URL.parse(url).query;
        let obj = querystring.parse(query);
        return JSON.parse(obj[queryName]);
    },
    packOut: out.packOut,
    unpackOut: out.unpackOut
};

/**
 * caller (options, apiName, ins) -> out
 */
let rcPost = {
    packIn: ({
        options,
        apiName,
        ins
    } = {}) => {
        return {
            options: def({
                headers: {},
                path: '/api',
                method: 'POST'
            }, options),
            body: JSON.stringify([apiName, ins])
        };
    },
    unpackIn: (rawIn) => {
        let body = rawIn.body;
        body = body ? JSON.parse(body + '') : '';
        return body;
    },
    packOut: out.packOut,
    unpackOut: out.unpackOut
};

/**
 * caller (options, apiName, ins) -> out
 */
let rc = {
    packIn: (ins = {}) => {
        let options = ins.options || {};
        let method = options.method || '';
        if (method.toUpperCase() === 'POST') {
            return rcPost.packIn(ins);
        } else {
            return rcGet.packIn(ins);
        }
    },
    unpackIn: (rawIn) => {
        let method = rawIn.options.method;
        if (method === 'POST') {
            return rcPost.unpackIn(rawIn);
        } else {
            return rcGet.unpackIn(rawIn);
        }
    },
    packOut: out.packOut,
    unpackOut: out.unpackOut
};

/**
 * api calling error processor
 *
 * 1. packOut. if out is an special exception object (not real exception), wrap data to a special json
 *    {
 *        error: null,
 *        data: any
 *    }
 *    or
 *    {
 *        error: {
 *            type: String,
 *            message: String,
 *            details: any
 *        },
 *        data: null
 *    }
 * 2. unpackOut. parse to the special json, if it's error type, throw it.
 */
let unique = {};

let exception = (type, message, details) => {
    return {
        error: {
            type,
            message,
            details
        },
        unique
    };
};

let ResponseError = function (obj) {
    this.type = 'responseError';
    if (obj && typeof obj === 'object') {
        for (let name in obj) {
            this[name] = obj[name];
        }
    }
};

ResponseError.prototype = new Error();

ResponseError.prototype.constructor = ResponseError;

ResponseError.prototype.toString = function () {
    return this.message;
};

let ep = {
    packOut: (outdata) => {
        let data = outdata;
        if (outdata && typeof outdata === 'object' && outdata.unique === unique) {
            data = {
                error: outdata.error,
                data: null
            };
        } else {
            data = {
                error: null,
                data: outdata
            };
        }
        return out.packOut(data);
    },
    unpackOut: (rawOut) => {
        let outdata = out.unpackOut(rawOut);
        if (outdata.error) {
            throw new ResponseError(outdata.error);
        } else {
            return outdata.data;
        }
    }
};

export default {
    rcGet: new Processor(rcGet),
    rcPost: new Processor(rcPost),
    rc: new Processor(rc),
    exception,
    ep: new Processor(ep)
};
