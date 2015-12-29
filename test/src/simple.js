import assert from 'assert';
import http from 'http';
import interflow from '../../index';

require('babel-polyfill');

describe('simple http interflow', () => {
    it('simple interflow', (done) => {
        let methodMap = {
            'add': (a, b) => a + b
        };

        let processor = interflow.processors.simpleHttp;

        let methodFinder = (rawIn) => methodMap[rawIn.body[0]];

        let midGen = interflow.responsers.httpResponser(
            processor, methodFinder, {
                output: true
            });

        let server = http.createServer((req, res) => {
            let chunks = [];
            req.on('data', (chunk) => {
                chunks.push(chunk);
            });

            req.on('end', () => {
                let body = chunks.join('');
                midGen(req, res, body);
            });
        });

        server.listen(0, async () => {
            let port = server.address().port;

            let httpConnect = interflow.connects.httpConnect;

            let ret = await processor.getCaller()(httpConnect)({
                hostname: '127.0.0.1',
                port
            }, 'add', [1, 2]);

            assert.equal(ret, 3);
            done();
        });
    });
});