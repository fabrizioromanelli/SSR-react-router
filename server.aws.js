//
// This module is the server to be called from AWS lambda
//
'use strict'

require('babel-register');
const server = require('./src/server');
module.exports = server;
