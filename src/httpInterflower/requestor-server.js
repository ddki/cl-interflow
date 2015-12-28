import protocol from '../protocol';
import requestor from '../util/requestor';

/**
 * packIn::: ins -> rawIn
 *
 * rawIn = {options, body}
 */

module.exports = (packIn, unpackOut, options = {}) => {
    let request = requestor(options.protocol || 'http', {
        bodyParser: (body) => JSON.parse(body)
    });

    let connect = (rawIn) => new Promise((resolve, reject) => {
        let postData = '';
        if(rawIn.body) postData = JSON.stringify(rawIn.body);
        request(rawIn.options, postData).then((rawOut) => {
            resolve(rawOut);
        }).catch(err => reject(err));
    });

    return protocol.caller(packIn, unpackOut)(connect);
};