'use strict'

const writeEntry = require('./writeEntry')

/**
 * Converts an array into a directory structure.
 * @public
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @returns {Promise<Array>} Original structure passed to the function.
 */
module.exports = function(structure = []) {
	return new Promise((resolve, reject) => {
		const query = structure.map((entry) => writeEntry(entry, module.exports))

		Promise.all(query)
			.then(resolve, reject)
	})
}