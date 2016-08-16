/**
 *  AirMap Platform Client Library - JS
 *  @module airmap-client-js
 */


((root, factory) => {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory)
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory()
    } else {
        // Browser globals (root is window).
        root.AirMapClient = factory(root)
    }
})(this, () => {
    'use strict'

    const AirMapClient = require('./core')

    return AirMapClient
})
