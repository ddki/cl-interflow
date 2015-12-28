import simpleRule from './simpleRule';
import requestor from '../util/requestor';

module.exports = (options) => {
    let request = requestor('http', {
        bodyParser: (body) => JSON.parse(body)
    });

    let connect = (rawIn) => new Promise((resolve, reject) => {
        request(rawIn.options, JSON.stringify(rawIn.body)).then((rawOut) => {
            resolve(rawOut);
        }).catch(err => reject(err));
    });

    return simpleRule.requestor(connect, {
        optionsWraper: (ops) => def(ops, options)
    });
};

let def = (m1={}, m2={}) => {
    for(let name in m2) {
        m1[name] = m2[name];
    }
    return m1;
};