import { processor } from '../../index';
import assert from 'assert';
require('babel-polyfill');

describe('processor', () => {
    it('simple interflow', async () => {
        let methodFinder = () => (a, b) => a + b;
        let del = processor.dealer()(methodFinder);

        let connect = del;

        let cal = processor.caller()(connect);

        let res = await cal(1, 2);
        assert.equal(res, 3);
    });

    it('map function', async () => {
        let methodMap = {
            'add': (a, b) => a + b
        };
        let unpackIn = v => v[1];
        let packOut = v => v;
        let methodFinder = (rawIn) => methodMap[rawIn[0]];

        let deal = processor.dealer(unpackIn, packOut)(methodFinder);

        let callGen = (type) => {
            let packIn = (...ins) => [type, ins];
            let unpackOut = v => v;

            let connect = deal;

            let call = processor.caller(packIn, unpackOut)(connect);
            return call;
        };

        let res = await callGen('add')(1, 2);
        assert.equal(res, 3);
    });
});