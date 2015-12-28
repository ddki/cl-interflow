import responser from '../httpInterflower/responser';
import {unpackIn, packOut} from './simpleDataProcessor';

module.exports = (getMethod, opts = {}) => {
    let methodFinder = (rawIn) => {
        let apiName = rawIn.body[0];
        return getMethod(apiName, rawIn);
    };

    return responser(unpackIn, packOut, methodFinder, opts);
};