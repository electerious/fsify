'use strict'

/**
 * Checks if something is a representation of a directory.
 * @public
 * @param {?*} type
 * @returns {Boolean}
 */
module.exports = function(type) {

	// Get constant during fn call. Would be empty otherwise.
	const DIRECTORY = require('./index').DIRECTORY

	if (type===DIRECTORY) return true

	return false

}