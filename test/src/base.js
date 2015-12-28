import { processor } from '../../index';
import assert from 'assert';
require('babel-polyfill');

describe('processor', () => {
    it('simple interflow', async () => {
        let methodFinder = () => (a, b) => a + b;
        let del = processor.dealer()(methodFinder);

        let connect = async (rawIn) => {
            return await del(rawIn);
        };
        let cal = processor.caller()(connect);

        let res = await cal(1, 2);
        assert.equal(res, 3);
    });
});