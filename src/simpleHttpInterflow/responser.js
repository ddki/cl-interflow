import responser from '../httpInterflower/responser';
import simple from './simple';

console.log(simple.getUnpackIn);

module.exports = (getMethod, opts = {}) => {
    let methodFinder = (rawIn) => {
        let apiName = rawIn.body[0];
        return getMethod(apiName, rawIn);
    };

    return responser(simple.getUnpackIn(), simple.getPackOut(), methodFinder, opts);
};