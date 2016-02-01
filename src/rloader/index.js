import plainhttp from '../plainhttp';
import path from 'path';

let processors = plainhttp.processors;
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

let getApiMethod = (apiObj, acts) => {
    let apiMethod = apiObj;
    for (let i = 0; i < acts.length; i++) {
        let act = acts[i].trim();
        if (act) {
            if (act[0] === '.') {
                if (!apiObj)
                    return null;
                apiMethod = apiObj[act.substring(1)];
            }
        }
    }
    return apiMethod;
};

let defProcessor = processors.ep.pack(processors.rc);

module.exports = (opts = {}) => {
    let processor = opts.processor || defProcessor;
    opts.processor = processor;

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
        let arr = filePath.split('$');
        arr.shift();
        let apiMethod = getApiMethod(apiObj, arr);

        if (typeof apiMethod !== 'function') {
            return processors.exception('missing api', 'api method is not a function');
        }

        return apiMethod.apply(this, args);
    };

    let mid = mider(method);

    let load = (p, options = {}) => {
        let req = (...ins) => {
            return caller({
                options,
                apiName: p,
                ins
            });
        };

        // TODO sub options
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
