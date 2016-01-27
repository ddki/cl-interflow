import plainhttp from '../plainhttp';

/**
 * remote loader
 *
 * load remote js module like loading them at same end.
 *
 * let { login } = require('method/user.js');
 *
 * await login(userName, password);
 *
 * apiName: method/user.js?method=login  or method/getProject.js
 *
 * TODO: api combination
 */

module.exports = (opts) => {
   let { mider, caller } = plainhttp(opts);
   let method = (ins) => {
       let apiName = ins[0];
       let args = ins[1];
       // find method file and method
   };
   let newMider = () => {};
};
