import { protocol } from '../../index';
import assert from 'assert';

require('babel-polyfill');

describe('protocol', () => {
    it('simple interflow', async () => {
        let method = (ins) => ins[0] + ins[1];
        let del = protocol.dealer()(method);

        let connect = del;

        let cal = protocol.caller()(connect);

        let res = await cal([1, 2]);
        assert.equal(res, 3);
    });

    it('map function', async () => {
        let methodMap = {
            'add': (a, b) => a + b
        };
        let unpackIn = v => v;
        let packOut = v => v;

        let method = (ins) => {
            let type = ins[0], args = ins[1];
            return methodMap[type].apply(undefined, args);
        };

        let deal = protocol.dealer(unpackIn, packOut)(method);

        let connect = deal;

        let call = protocol.caller()(connect);

        let res = await call(['add', [1, 2]]);
        assert.equal(res, 3);
    });
});