import querystring from 'querystring';
import Processor from '../processor';
import URL from 'url';

const queryName = '__data';

let def = (m1 = {}, m2 = {}) => {
    for (let name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};

module.exports = new Processor({
    packIn: ({options, apiName, ins}) => {
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
    packOut: (out) => {
        return {
            body: out,
            headers: {
                'content-type': 'application/json; charset=UTF-8'
            }
        };
    },
    unpackOut: (rawOut) => rawOut.body
});