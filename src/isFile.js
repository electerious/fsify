'use strict'

/**
 * Checks if something is a representation of a file.
 * @public
 * @param {?*} type
 * @returns {Boolean}
 */
module.exports = function(type) {
	// Get constant during fn call. Would be empty otherwise.
	const FILE = require('./index').FILE

	if (type === FILE) return true

	return false
}