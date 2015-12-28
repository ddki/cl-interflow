import serverRequestor from '../httpInterflower/requestor-server';
import simple from './simple';

module.exports = (options = {}) => (apiName) =>
    (...ins) => serverRequestor(
        simple.getPackIn(),
        simple.getUnpackOut(),
        options)(apiName, options, ins);