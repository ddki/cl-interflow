import serverRequestor from '../httpInterflower/requestor-server';
import simpleRule from './simpleRule';

module.exports = (options = {}) => (apiName) =>
    (...ins) => serverRequestor(
        simpleRule.packIn,
        simpleRule.unpackOut,
        options)(apiName, options, ins);