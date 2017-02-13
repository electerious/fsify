'use strict'

const fs   = require('fs')
const pify = require('pify')

module.exports = function(path, data, encoding, mode, flag) {

	return pify(fs.writeFile)(path, data, {
		encoding,
		mode,
		flag
	})

}