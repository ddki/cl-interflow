import protocol from '../protocol';

let id = v => v;

let requestor = (connect, opts) => (apiName) => {
    opts.optionsWraper = opts.optionsWraper || id;
    let packIn = (ins) => {
        let options = opts.optionsWraper({
            headers: {},
            path: '/api',
            method: 'POST'
        });
        let body = [apiName, ins];
        return {
            options,
            body
        };
    };

    return protocol.caller(packIn, unpackOut)(connect);
};

let unpackOut = (rawOut) => rawOut.body;

let unpackIn = (rawIn) => rawIn.body[1];

let packOut = (out) => {
    return {
        body: out
    };
};

let responser = (methodFinder) => protocol.dealer(unpackIn, packOut)(methodFinder);

module.exports = {
    requestor,
    responser
};