import koa from 'koa';
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

    it('null: does no exists', async() => {
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
        let ret = await test.prop('obj').prop('fake').get('fake2')();
        assert.equal(ret, null);
    });

    it('safeDir', async(done) => {
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
            safeDir: __dirname
        });

        let test = load('../fixture/loader-test.js');
        try {
            await test.prop('obj')();
        } catch (err) {
            assert.equal(err.type, 'no permission');
            done();
        }
    });

    it('proxy', async() => {
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
            root: __dirname,
            proxy: (method) => {
                return async(ins) => {
                    let res = await method(ins);
                    return 2 * res;
                };
            }
        });

        let test = load('../fixture/loader-test.js');
        let ret = await test(2, 3);
        assert.equal(ret, 10);
    });

    it('promise', async() => {
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
        let ret = await test.prop('addp')(7, 3);
        assert.equal(ret, 10);
    });


    it('koa mid', async() => {
        let {
            mid, load
        } = rloader({
            root: __dirname,
            midForm: 'koaMidForm'
        });

        const app = koa();

        app.use(function*(next) {
            this.request.body =
                yield getReqBody(this.req);
            yield next;
        });

        app.use(mid);

        let server = http.createServer(app.callback());

        await listen(server, 0);

        let test = load('../fixture/loader-test.js', {
            port: server.address().port,
            method: 'POST'
        });
        let ret = await test(2, 3);
        assert.equal(ret, 5);
    });

    it('koa promise', async() => {
        let {
            mid, load
        } = rloader({
            root: __dirname,
            midForm: 'koaMidForm'
        });

        const app = koa();

        app.use(mid);

        let server = http.createServer(app.callback());

        await listen(server, 0);

        let test = load('../fixture/loader-test.js', {
            port: server.address().port
        });
        let ret = await test.prop('addp')(2, 3);
        assert.equal(ret, 5);
    });

    it('ctx', async() => {
        let {
            mid, load
        } = rloader({
            root: __dirname,
            midForm: 'koaMidForm'
        });

        const app = koa();

        app.use(function*(next) {
            this.test_var = 100;
            yield next;
        });

        app.use(mid);

        let server = http.createServer(app.callback());

        await listen(server, 0);

        let test = load('../fixture/loader-test.js', {
            port: server.address().port
        });
        let ret = await test.prop('testCtx')();
        assert.equal(ret, 100);
    });

});
