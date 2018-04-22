'use strict'

const get = require('./get')

/**
 * Flattens a structure to an array that only contains the name of each entries.
 * @public
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @returns {Array} flattenedStructure
 */
module.exports = function(structure = []) {

	return structure.reduce((entries, entry) => {

		const { name, contents, isDirectory } = get(entry)

		entries = [ ...entries, name ]

		if (isDirectory === true) {

			entries = [
				...entries,
				...module.exports(contents)
			]

		}

		return entries

	}, [])

}