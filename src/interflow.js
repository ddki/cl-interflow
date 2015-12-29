import protocol from './protocol';
import Processor from './processor';

import httpConnect from './connect/httpConnect';
import httpsConnect from './connect/httpsConnect';

import httpResponser from './responser/httpResponser';

import simpleHttp from './processor/simpleHttp';

module.exports = {
    protocol,
    Processor,
    connects: {
        httpConnect,
        httpsConnect
    },
    responsers: {
        httpResponser
    },
    processors: {
        simpleHttp
    }
};