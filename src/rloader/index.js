import plainhttp from '../plainhttp';
import path from 'path';

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
 * TODO: api combination
 */

let id = v => v;

let joinAct = (p, act) => {
    if (p.indexOf('?') === -1)
        p = p + '?';
    return p + '$' + act;
};

let requireJs = (filePath) => {
    try {
        return require(filePath);
    } catch (err) {
        return null;
    }
};

let getRet = (apiPath, apiObj, args) => {
    let arr = apiPath.split('$');
    arr.shift();
    let apiMethod = getApiMethod(apiObj, arr);

    if (typeof apiMethod === 'function') {
        return apiMethod.apply(this, args);
    } else {
        return apiMethod;
    }
};

let getApiMethod = (apiObj, acts) => {
    let apiMethod = apiObj;
    for (let i = 0; i < acts.length; i++) {
        let act = acts[i].trim();
        if (act) {
            if (act[0] === '.') {
                if (!apiMethod)
                    return null;
                apiMethod = apiMethod[act.substring(1)];
            }
        }
    }
    return apiMethod;
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

    let proxy = opts.proxy || id;
    let root = opts.root || '.';
    let safeDir = opts.safeDir;
    let {
        mider, caller
    } = plainhttp(opts);

    let method = function (ins) {
        let apiPath = ins[0];
        let args = ins[1];
        // find method file and method
        let filePath = apiPath.split('?')[0];
        filePath = path.normalize(path.join(root, filePath));
        if (safeDir && filePath.indexOf(path.normalize(safeDir)) !== 0) {
            // throw error to requestor
            return processors.exception('no permission', 'you can not refer a file which is not in safe dir', {
                filePath,
                safeDir
            });
        }
        //
        let apiObj = requireJs(filePath);
        if (!apiObj)
            return processors.exception('missing api', 'api filepath does not exist.', {
                filePath
            });
        return getRet(apiPath, apiObj, args);
    };

    let mid = mider(proxy(method));

    let load = (p, options = {}) => {
        options = assign(options, opts.reqOptions);
        let req = (...ins) => {
            return caller({
                options,
                apiName: p,
                ins
            });
        };

        req.get = req.prop = (name) => {
            let newPath = joinAct(p, '.' + name);
            return load(newPath, options);
        };
        return req;
    };

    return {
        mid,
        load
    };
};
