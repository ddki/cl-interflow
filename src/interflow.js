import protocol from './protocol';
import Processor from './processor';

import httpConnect from './connect/httpConnect';
import httpsConnect from './connect/httpsConnect';

import simpleHttp from './processor/simpleHttp';
import httpReqProcessor from './processor/httpReqProcessor';

import resFlusher from './flusher/resFlusher';

module.exports = {
    protocol,
    Processor,
    connects: {
        httpConnect,
        httpsConnect
    },
    processors: {
        simpleHttp,
        httpReqProcessor
    },
    flushers: {
        resFlusher
    }
};