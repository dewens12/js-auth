/**
 * Testing setup
 */

// Sets up jsdom to handle browser specific checks
var jsdom = require('jsdom');
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.location = window.location || {};
global.navigator = global.window.navigator;
