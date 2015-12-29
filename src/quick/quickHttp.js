import quickGetHttp from './quickGetHttp';
import quickPostHttp from './quickPostHttp';

let mider = (find) => {
    let getMider = quickGetHttp.mider(find);
    let postMider = quickPostHttp.mider(find);
    return (req, res, body) => {
        if(req.method === 'GET') {
            return getMider(req, res, body);
        }
        else if(req.method === 'POST') {
            return postMider(req, res, body);
        }
    };
};

let getApi = (options = {}) => {
    let method = options.method || 'GET';
    method = method.toUpperCase();
    if(method === 'GET') {
        return quickGetHttp.getApi(options);
    } else {
        return quickPostHttp.getApi(options);
    }
};

module.exports = {
    mider,
    getApi
};