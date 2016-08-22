/**
 *  AirMap Auth0 Lock Module - JS
 *  @module airmap-auth
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window).
        root.AirMapAuth = factory();
    }
})(window, function() {
    'use strict'
    const AirMapAuth = require('./core');
    return AirMapAuth;
})