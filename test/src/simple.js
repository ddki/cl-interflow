import assert from 'assert';
import http from 'http';
import {processors, connects, flushers} from '../../index';
require('babel-polyfill');

let listen = (server, port) => new Promise((resolve) => {
    server.listen(port, async () => {
        resolve(server);
    });
});

let getReqBody = (req) => new Promise((r) => {
    let chunks = [];
    req.on('data', (chunk) => {
        chunks.push(chunk);
    });

    req.on('end', () => {
        let body = chunks.join('');
        r(body);
    });
});

describe('simple http interflow', () => {
    it('simple interflow', async () => {
        // assemble processors
        let processor = processors.simpleHttp.pack(
            processors.httpReqProcessor
        );

        // create response
        let methodMap = {
            'add': (a, b) => a + b
        };
        let response = processor.getDealer(
            (ins) => methodMap[ins[0]].apply(undefined, ins[1])
        );

        // create http server
        let server = http.createServer(async (req, res) => {
            let body = await getReqBody(req);
            // deal request
            response({req, body}, flushers.resFlusher(res));
        });

        await listen(server, 0);

        let port = server.address().port;

        let request = processor.getCaller(
            connects.httpConnect
        );

        let remoteAdd = async (a, b) => await request({
            options: {
                hostname: '127.0.0.1',
                port
            },
            apiName: 'add',
            ins: [a, b]
        });

        let ret = await remoteAdd(2, 4);

        assert.equal(ret, 6);
    });
});