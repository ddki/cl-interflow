import responser from '../httpInterflower/responser';
import simpleRule from './simpleRule';

module.exports = (getMethod, opts = {}) => {
    let methodFinder = (rawIn) => {
        let apiName = rawIn.body[0];
        return getMethod(apiName, rawIn);
    };

    return responser(simpleRule.unpackIn, simpleRule.packOut, methodFinder, opts);
};