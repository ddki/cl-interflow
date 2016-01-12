import browserRequestor from '../util/browserRequestor';

/**
 * packIn::: ins -> rawIn
 *
 * rawIn = {options, body}
 */

let request = browserRequestor();

module.exports = (rawIn) => request(rawIn.options, rawIn.body);