import httpReqProcessor from '../processor/httpReqProcessor';
import resFlusher from '../flusher/resFlusher';
import httpConnect from '../connect/httpConnect';
import httpsConnect from '../connect/httpsConnect';

module.exports = (httpProcessor, t = 'http') => {
    let connect = t === 'https' ? httpsConnect : httpConnect;

    // assemble processors
    let processor = httpProcessor.pack(
        httpReqProcessor
    );

    let mider = (find) => {
        let response = processor.getDealer(
                (ins) => find(ins[0], ins[1]).apply(undefined, ins[1])
            );
        return (req, res, body) => {
            return response({
                req, body
            }, resFlusher(res));
        };
    };

    let request = processor.getCaller(
        connect
    );

    let getApi = (options = {}) => (apiName) => (...ins) => request({
        options,
        apiName: apiName,
        ins
    });

    return {
        mider,
        getApi
    };
};