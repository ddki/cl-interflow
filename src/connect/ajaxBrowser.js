import browserRequestor from '../util/browserRequestor';

/**
 * packIn::: ins -> rawIn
 *
 * rawIn = {options, body}
 */

let request = browserRequestor({
    bodyParser: (body) => body && JSON.parse(body)
});

module.exports = (rawIn) => request(rawIn.options, rawIn.body);