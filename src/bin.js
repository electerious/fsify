'use strict'

/**
 * Holds an encapsulated array.
 * @public
 * @returns {Function} - Function to get or add items.
 */
module.exports = function() {
	let bin = []

	return (...args) => {
		bin = [ ...bin, ...args ]

		return bin
	}
}