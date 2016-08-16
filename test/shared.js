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

module.exports = { chai, expect, sinon }
