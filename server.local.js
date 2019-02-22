//
// This module is the server to be called for local development
//
'use strict'

require('babel-register');
const server = require('./src/server');

// Run server
const port = process.env.PORT || 3000
server.listen(port, err => {
	if (err) return console.error(err)
	console.log(`Server listening at http://localhost:${port}`)
})
