'use strict'

const writeEntry = require('./writeEntry')

/**
 * Converts an object into a directory structure.
 * @public
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @param {String} cwd - Directory to start from.
 * @returns {Promise}
 */
module.exports = function(structure = [], cwd) {

	return new Promise((resolve, reject) => {

		const query = structure.map((entry) => writeEntry(entry, cwd))

		Promise.all(query).then(resolve, reject)

	})

}