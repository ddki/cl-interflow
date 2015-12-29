import assert from 'assert';
import http from 'http';
import interflow from '../../index';

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
        let processor = interflow.processors.simpleHttp;

        let methodMap = {
            'add': (a, b) => a + b
        };

        let method = (type, args) => {
            return methodMap[type].apply(undefined, args);
        };

        let midGen = interflow.responsers.httpResponser(
            processor, method, {
                output: true
            });

        let server = http.createServer(async (req, res) => {
            let body = await getReqBody(req);
            midGen(req, res, body);
        });

        await listen(server, 0);

        let port = server.address().port;
        let httpConnect = interflow.connects.httpConnect;

        let remoteAdd = async (a, b) => await processor.getCaller(httpConnect)({
            hostname: '127.0.0.1',
            port
        }, 'add', [a, b]);

        let ret = await remoteAdd(2, 4);

        assert.equal(ret, 6);
    });
});