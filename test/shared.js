'use strict'

/**
 * Export shared dependencies so they can be included more easily in each test
 * i.e. const { chai, expect, sinon } = require('../shared')
 */

const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const configMock = {
    "airmap": {
        "api_key": "ey123abc"
    },
    "auth0": {
        "client_id": "def456",
        "callback_url": "localhost:8080"
    },
    "mapbox": {
        "access_token": "0321654"
    }
}

const defaultOptions = {
    autoLaunch: false,
    domain: 'sso.airmap.io',
    language: 'en',
    logo: 'https://cdn.airmap.io/img/login-logo.png',
    onAuthenticated: (authResult) => null
}


module.exports = {
    chai,
    configMock,
    defaultOptions,
    expect,
    sinon
}
