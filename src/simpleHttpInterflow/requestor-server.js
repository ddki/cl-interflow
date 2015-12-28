import serverRequestor from '../httpInterflower/requestor-server';
import {packIn, unpackOut} from './simpleDataProcessor';

module.exports = (options = {}) => (apiName) =>
    (...ins) => serverRequestor(
        packIn,
        unpackOut,
        options)(apiName, options, ins);