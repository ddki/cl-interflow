import purePostHttp from '../processor/purePostHttp';
import httpReqProcessor from '../processor/httpReqProcessor';
import resFlusher from '../flusher/resFlusher';
import httpConnect from '../connect/httpConnect';

// assemble processors
let processor = purePostHttp.pack(
    httpReqProcessor
);

let mider = (find) => (req, res, body) => {
    let response = processor.getDealer(
        (ins) => find(ins[0], ins[1]).apply(undefined, ins[1])
    );
    return response({req, body}, resFlusher(res));
};

let request = processor.getCaller(
    httpConnect
);

let getApi = (options = {}) => (apiName) => (...ins) => request({
    options,
    apiName: apiName,
    ins
});

module.exports = {
    mider,
    getApi
};