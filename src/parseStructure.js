'use strict'

const parseEntry = require('./parseEntry')

/**
 * Parses an array that represents a directory structure.
 * @public
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @param {String} cwd - Directory to start from.
 * @returns {Promise} Returns the following properties if resolved: {Array}.
 */
module.exports = function(structure = [], cwd) {

	return new Promise((resolve, reject) => {

		const query = structure.map((entry) => parseEntry(entry, cwd, module.exports))

		Promise.all(query)
			.then(resolve, reject)

	})

}