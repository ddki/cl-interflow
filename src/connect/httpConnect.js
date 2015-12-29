import requestor from '../util/requestor';

/**
 * packIn::: ins -> rawIn
 *
 * rawIn = {options, body}
 */

let request = requestor('http', {
    bodyParser: (body) => JSON.parse(body)
});

module.exports = (rawIn) => new Promise((resolve, reject) => {
    let postData = '';
    if(rawIn.body) postData = JSON.stringify(rawIn.body);
    request(rawIn.options, postData).then((rawOut) => {
        resolve(rawOut);
    }).catch(err => reject(err));
});