let def = (m1 = {}, m2 = {}) => {
    for (let name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};

module.exports = {
    packInGen: (apiName, options) => (ins) => {
        return {
            options: def({
                headers: {},
                path: '/api',
                method: 'POST'
            }, options),
            body: [apiName, ins]
        };
    },
    unpackIn: (rawIn) => rawIn.body[1],
    packOut: (out) => {
        return {
            body: out
        };
    },
    unpackOut: (rawOut) => rawOut.body
};