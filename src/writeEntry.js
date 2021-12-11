'use strict'

const get = require('./get')
const writeDirectory = require('./writeDirectory')
const writeFile = require('./writeFile')

/**
 * Writes an entry as directory or file.
 * @public
 * @param {Object} entry - Objects containing information about a directory or file.
 * @param {Function} writeStructure - Function that converts an array into a directory structure.
 * @returns {Promise<Object>} Original entry passed to the function.
 */
module.exports = function(entry, writeStructure) {
	return new Promise((resolve, reject) => {
		const { name, contents, encoding, mode, flag, isDirectory, isFile } = get(entry)

		if (isDirectory === true) {
			return writeDirectory(name, mode)
				.then(() => writeStructure(contents, name))
				.then(() => entry)
				.then(resolve, reject)
		}

		if (isFile === true) {
			return writeFile(name, contents, encoding, mode, flag)
				.then(() => entry)
				.then(resolve, reject)
		}

		throw new Error(`Unknown entry type for entry with the name '${ name }'`)
	})
}