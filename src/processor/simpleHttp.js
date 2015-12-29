import Processor from '../processor';

let def = (m1 = {}, m2 = {}) => {
    for (let name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};

module.exports = new Processor({
    packIn: (options, apiName, ins) => {
        return {
            options: def({
                headers: {},
                path: '/api',
                method: 'POST'
            }, options),
            body: [apiName, ins]
        };
    },
    unpackIn: (rawIn) => {
        return rawIn.body;
    },
    packOut: (out) => {
        return {
            body: out
        };
    },
    unpackOut: (rawOut) => rawOut.body
});