import plainhttp from '../plainhttp/ajaxCaller.js';

let processors = plainhttp.processors;
let defProcessor = processors.ep.pack(processors.rc);
/**
 * remote loader
 *
 * load remote js module like loading them at same end.
 *
 * let user = load('method/user.js');
 *
 * await user.get('login')(userName, password);
 *
 * apiName: method/user.js?$.login
 *
 */

let joinAct = (p, act) => {
    if (p.indexOf('?') === -1)
        p = p + '?';
    return p + '$' + act;
};

let assign = (init = {}, next = {}) => {
    for (let name in next) {
        init[name] = next[name];
    }
    return init;
};

/**
 * opts
 *      safeDir
 *      root
 *      proxy
 */
module.exports = (opts = {}) => {
    let processor = opts.processor || defProcessor;
    opts.processor = processor;

    let {caller} = plainhttp(opts);

    let load = (p, options = {}) => {
        options = assign(options, opts.reqOptions);
        let req = (...ins) => {
            return caller({
                ins,
                options,
                apiName: p
            });
        };

        req.get = req.prop = (name) => {
            let newPath = joinAct(p, '.' + name);
            return load(newPath, options);
        };
        return req;
    };

    return {
        load
    };
};
