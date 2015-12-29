import { protocol } from '../../index';
import assert from 'assert';

require('babel-polyfill');

describe('protocol', () => {
    it('simple interflow', async () => {
        let method = (a, b) => a + b;
        let del = protocol.dealer()(method);

        let connect = del;

        let cal = protocol.caller()(connect);

        let res = await cal(1, 2);
        assert.equal(res, 3);
    });

    it('map function', async () => {
        let methodMap = {
            'add': (a, b) => a + b
        };
        let unpackIn = v => v;
        let packOut = v => v;

        let method = (type, args) => {
            return methodMap[type].apply(undefined, args);
        };

        let deal = protocol.dealer(unpackIn, packOut)(method);

        let packIn = (type, args) => [type, args];
        let unpackOut = v => v;

        let connect = deal;

        let call = protocol.caller(packIn, unpackOut)(connect);

        let res = await call('add', [1, 2]);
        assert.equal(res, 3);
    });
});