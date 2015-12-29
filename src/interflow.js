import protocol from './protocol';
import Processor from './processor';

import httpConnect from './connect/httpConnect';
import httpsConnect from './connect/httpsConnect';

import purePostHttp from './processor/purePostHttp';
import httpReqProcessor from './processor/httpReqProcessor';

import resFlusher from './flusher/resFlusher';

import quickPostHttp from './quick/quickPostHttp';

module.exports = {
    protocol,
    Processor,
    connects: {
        httpConnect,
        httpsConnect
    },
    processors: {
        purePostHttp,
        httpReqProcessor
    },
    flushers: {
        resFlusher
    },
    quicks: {
        quickPostHttp
    }
};