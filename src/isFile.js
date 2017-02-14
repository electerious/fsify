'use strict'

/**
 * Checks if something is a representation of a file.
 * @public
 * @param {?*} type
 * @param {?*} contents
 * @returns {Boolean}
 */
module.exports = function(type, contents) {

	// Get constant during fn call. Would be empty otherwise.
	const FILE = require('./index').FILE

	if (type===FILE)                      return true
	if (typeof contents==='string')       return true
	if (Buffer.isBuffer(contents)===true) return true

	return false

}