import serverRequestor from '../httpInterflower/requestor-server';
import simpleRule from './simpleRule';

module.exports = (options = {}) => (apiName) =>
    serverRequestor(
        simpleRule.packInGen(apiName, options),
        simpleRule.unpackOut,
        options);