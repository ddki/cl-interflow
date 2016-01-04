import protocol from './protocol';
import Processor from './processor';

import httpConnect from './connect/httpConnect';
import httpsConnect from './connect/httpsConnect';

import purePostHttp from './processor/purePostHttp';
import pureGetHttp from './processor/pureGetHttp';
import httpReqProcessor from './processor/httpReqProcessor';

import resFlusher from './flusher/resFlusher';

import quickHttp from './quick/quickHttp';

module.exports = {
    protocol,
    Processor,
    connects: {
        httpConnect,
        httpsConnect
    },
    processors: {
        purePostHttp,
        pureGetHttp,
        httpReqProcessor
    },
    flushers: {
        resFlusher
    },
    quicks: {
        quickHttp
    }
};