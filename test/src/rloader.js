import assert from 'assert';
import http from 'http';
import {
    plainhttp
}
from '../../index';
require('babel-polyfill');

let listen = (server, port) => new Promise((resolve) => {
    server.listen(port, () => {
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

describe('rloader', () => {
    it('base', async() => {
        let {
            caller,
            mider
        } = plainhttp();

        let mid = mider(() => {
            return {
                body: 'hello world'
            };
        });

        let server = http.createServer(async(req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);

        let res = await caller({
            options: {
                hostname: '127.0.0.1',
                port: server.address().port
            }
        });
        assert.equal(res.body, 'hello world');
    });
});
