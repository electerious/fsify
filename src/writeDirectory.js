'use strict'

const pify   = require('pify')
const mkdirp = require('mkdirp')

/**
 * Creates a new directory and any necessary subdirectories.
 * Reuses existing directories without deleting them.
 * @public
 * @param {String} path - Path to create.
 * @param {?String} mode - If a directory needs to be created, set the mode to this octal permission string.
 * @returns {Promise}
 */
module.exports = function(path, mode) {

	return pify(mkdirp)(path, {
		mode
	})

}