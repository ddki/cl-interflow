import assert from 'assert';
import http from 'http';
import {
    rloader
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
        let server = http.createServer(async(req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);
        let {
            mid, load
        } = rloader({
            root: __dirname
        });

        let testFun = load('../fixture/loader-test.js', {
            port: server.address().port
        });
        let ret = await testFun(14, 12);
        assert.equal(ret, 26);
    });

    it('prop', async() => {
        let server = http.createServer(async(req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);
        let {
            mid, load
        } = rloader({
            reqOptions: {
                port: server.address().port
            },
            root: __dirname
        });

        let test = load('../fixture/loader-test.js');
        let ret = await test.prop('mul')(14, 12);
        assert.equal(14 * 12, ret);
    });

    it('deep prop', async() => {
        let server = http.createServer(async(req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);
        let {
            mid, load
        } = rloader({
            reqOptions: {
                port: server.address().port
            },
            root: __dirname
        });

        let test = load('../fixture/loader-test.js');
        let ret = await test.prop('mul').prop('next')(14, 2);
        assert.equal(7, ret);
    });

    it('get json like value', async() => {
        let server = http.createServer(async(req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);
        let {
            mid, load
        } = rloader({
            reqOptions: {
                port: server.address().port
            },
            root: __dirname
        });

        let test = load('../fixture/loader-test.js');
        let ret = await test.prop('obj')();
        assert.equal(ret.a, 10);
    });

    it('error: no file', async(done) => {
        let server = http.createServer(async(req, res) => {
            let body = await getReqBody(req);
            mid(req, res, body);
        });
        await listen(server, 0);
        let {
            mid, load
        } = rloader({
            reqOptions: {
                port: server.address().port
            },
            root: __dirname
        });

        try {
            let test = load('../fixture/fake-loader-test.js');
            let ret = await test.prop('obj')();
            assert.equal(ret.a, 10);
        } catch (err) {
            assert.equal(err.type, 'missing api');
            done();
        }
    });
});
