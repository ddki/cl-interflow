import quickHttpGen from './quickHttpGen';
import pureGetHttp from '../processor/pureGetHttp';
import purePostHttp from '../processor/purePostHttp';

module.exports = (opts = {}) => {
    let quickGetHttp = quickHttpGen({
        httpProcessor: pureGetHttp,
        flusher: opts.flusher
    });
    let quickPostHttp = quickHttpGen({
        httpProcessor: purePostHttp,
        flusher: opts.flusher
    });

    let mider = (find) => {
        let getMider = quickGetHttp.mider(find);
        let postMider = quickPostHttp.mider(find);
        return (req, res, body) => {
            if (req.method === 'GET') {
                return getMider(req, res, body);
            } else if (req.method === 'POST') {
                return postMider(req, res, body);
            }
        };
    };

    let getApi = (options = {}) => {
        let method = options.method || 'GET';
        method = method.toUpperCase();
        if (method === 'GET') {
            return quickGetHttp.getApi(options);
        } else if (method === 'POST') {
            return quickPostHttp.getApi(options);
        }
    };
    return {
        mider,
        getApi
    };
};