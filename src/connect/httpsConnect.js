import requestor from '../util/requestor';

/**
 * packIn::: ins -> rawIn
 *
 * rawIn = {options, body}
 */

let request = requestor('https', {
    bodyParser: (body) => body && JSON.parse(body)
});

module.exports = (rawIn) => request(rawIn.options, rawIn.body);