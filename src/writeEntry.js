'use strict'

const get            = require('./get')
const isDirectory    = require('./isDirectory')
const isFile         = require('./isFile')
const writeDirectory = require('./writeDirectory')
const writeFile      = require('./writeFile')

/**
 * Writes an entry as directory or file.
 * @public
 * @param {Object} entry - Objects containing information about a directory or file.
 * @param {Function} writeStructure - Function that converts an array into a directory structure.
 * @returns {Promise} Returns the following properties if resolved: {Object}.
 */
module.exports = function(entry, writeStructure) {

	return new Promise((resolve, reject) => {

		const { type, name, contents, encoding, mode, flag } = get(entry)

		if (isDirectory(type)===true) {

			return writeDirectory(name, mode)
				.then(() => writeStructure(contents, name))
				.then(() => entry)
				.then(resolve, reject)

		}

		if (isFile(type)===true) {

			return writeFile(name, contents, encoding, mode, flag)
				.then(() => entry)
				.then(resolve, reject)

		}

		throw new Error(`Unknown entry type for entry with the name '${ name }'`)

	})

}