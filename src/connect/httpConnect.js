import requestor from 'cl-requestor';

/**
 * packIn::: ins -> rawIn
 *
 * rawIn = {options, body}
 */

let request = requestor('http');

module.exports = (rawIn) => request(rawIn.options, rawIn.body);