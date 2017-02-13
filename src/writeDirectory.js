'use strict'

const pify   = require('pify')
const mkdirp = require('mkdirp')

module.exports = function(path, mode) {

	return pify(mkdirp)(path, {
		mode
	})

}