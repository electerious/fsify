'use strict'

const flatten = require('./flatten')

/**
 * Flattens a structure and adds it to the bin when structure shouldn't be persistent.
 * @public
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @param {Function} bin - A function that holds all non-persistent entries.
 * @param {Boolean} persistent
 * @returns {Promise<Array>} Original structure passed to the function.
 */
module.exports = function(structure = [], bin, persistent) {

	return new Promise((resolve) => {

		if (persistent===false) {

			const flattenedStructure = flatten(structure)

			bin(...flattenedStructure)

		}

		resolve(structure)

	})

}