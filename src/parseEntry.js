'use strict'

const path         = require('path')
const isPathInside = require('is-path-inside')
const get          = require('./get')

/**
 * Parses an entry (directory or file).
 * @public
 * @param {Object} entry - Objects containing information about a directory or file.
 * @param {String} cwd - Directory to start from.
 * @param {Function} parseStructure - Function that parses an array that represents a directory structure.
 * @returns {Promise} Returns the following properties if resolved: {Object}.
 */
module.exports = function(entry, cwd, parseStructure) {

	return new Promise((resolve, reject) => {

		entry = Object.assign({}, entry)

		const { name, contents, isDirectory, isFile } = get(entry)

		// Resolve join to get rid of a leading slash that might occur.
		const absolutePath = entry.name = path.resolve(path.join(cwd, name))

		if (absolutePath===cwd) {
			throw new Error(`Entry name points to the same path as the surrounding structure`)
		}

		if (isPathInside(absolutePath, cwd)===false) {
			throw new Error(`Entry name points to a path outside the cwd`)
		}

		if (isDirectory===true) {

			return parseStructure(contents, absolutePath)
				.then((contens) => entry.contents = contens)
				.then(() => entry)
				.then(resolve, reject)

		}

		if (isFile===true) {

			return resolve(entry)

		}

		throw new Error(`Unknown entry type for entry with the name '${ name }'`)

	})

}