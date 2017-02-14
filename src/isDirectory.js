'use strict'

/**
 * Checks if something is a representation of a directory.
 * @public
 * @param {?*} type
 * @param {?*} contents
 * @returns {Boolean}
 */
module.exports = function(type, contents) {

	// Get constant during fn call. Would be empty otherwise.
	const DIRECTORY = require('./index').DIRECTORY

	if (type===DIRECTORY)               return true
	if (Array.isArray(contents)===true) return true

	return false

}