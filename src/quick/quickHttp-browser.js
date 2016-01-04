import httpReqProcessor from '../processor/httpReqProcessor';
import ajaxBrowser from '../connect/ajaxBrowser';
import pureGetHttp from '../processor/pureGetHttp';
import purePostHttp from '../processor/purePostHttp';

let getApiHigh = (processor, connect) => {
    let request = processor.getCaller(
        connect
    );

    let getApi = (options = {}) => (apiName) => (...ins) => request({
        options,
        apiName: apiName,
        ins
    });

    return getApi;
};

// assemble processors
let getProcessor = pureGetHttp.pack(
    httpReqProcessor
);

let postProcessor = purePostHttp.pack(
    httpReqProcessor
);

let getGetApi = getApiHigh(getProcessor, ajaxBrowser);

let postGetApi = getApiHigh(postProcessor, ajaxBrowser);

let getApi = (options = {}) => {
    let method = options.method || 'GET';
    method = method.toUpperCase();
    if (method === 'GET') {
        return getGetApi(options);
    } else if (method === 'POST') {
        return postGetApi(options);
    }
};

export default getApi;