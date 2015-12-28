import assert from 'assert';
import requestorServer from '../../lib/simpleHttpInterflow/requestor-server';
import responser from '../../lib/simpleHttpInterflow/responser';
import http from 'http';

require('babel-polyfill');

describe('simple http interflow', () => {
    it('simple interflow', (done) => {
        let methodMap = {
            'add': (a, b) => a + b
        };

        let midGen = responser((apiName) => methodMap[apiName], {
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
            let request = requestorServer({
                hostname: '127.0.0.1',
                port
            });
            let ret = await request('add')(1, 2);
            assert.equal(ret, 3);
            done();
        });
    });
});