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
        options, apiName, ins
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
        options, apiName, ins
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

export default {
    rcGet: new Processor(rcGet),
    rcPost: new Processor(rcPost),
    rc: new Processor(rc)
};