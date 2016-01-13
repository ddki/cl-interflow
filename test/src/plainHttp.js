import assert from 'assert';
import http from 'http';
import { plainhttp } from '../../index';
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

describe('plainhttp', () => {
    it('base', async () => {
        let {caller, mider} = plainhttp();

        let mid = mider(() => {
            return {
                body: 'hello world'
            };
        });

        let server = http.createServer(async (req, res) => {
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

    it('rcGet', async () => {
        let {caller, mider} = plainhttp({
            processor: plainhttp.processors.rcGet
        });

        let mid = mider((ins) => {
            if(ins[0] === 'add') {
                return ins[1][0] + ins[1][1];
            }
        });

        let server = http.createServer(async (req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);

        let ret = await caller({
            options: {
                hostname: '127.0.0.1',
                port: server.address().port
            },
            apiName: 'add',
            ins: [1, 2]
        });
        assert.equal(ret, 3);
    });

    it('rcPost', async () => {
        let {caller, mider} = plainhttp({
            processor: plainhttp.processors.rcPost
        });

        let mid = mider((ins) => {
            if(ins[0] === 'add') {
                return ins[1][0] + ins[1][1];
            }
        });

        let server = http.createServer(async (req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);

        let ret = await caller({
            options: {
                hostname: '127.0.0.1',
                port: server.address().port
            },
            apiName: 'add',
            ins: [100, -30]
        });
        assert.equal(ret, 70);
    });

    it('rc', async () => {
        let {caller, mider} = plainhttp({
            processor: plainhttp.processors.rc
        });

        let mid = mider((ins) => {
            if(ins[0] === 'add') {
                return ins[1][0] + ins[1][1];
            }
        });

        let server = http.createServer(async (req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);

        let ret = await caller({
            options: {
                hostname: '127.0.0.1',
                port: server.address().port
            },
            apiName: 'add',
            ins: [10, -30]
        });
        assert.equal(ret, -20);
    });
});