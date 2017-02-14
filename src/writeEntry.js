'use strict'

const path           = require('path')
const get            = require('./get')
const isDirectory    = require('./isDirectory')
const isFile         = require('./isFile')
const writeStructure = require('./writeStructure')
const writeDirectory = require('./writeDirectory')
const writeFile      = require('./writeFile')

/**
 * Writes an entry as directory or file.
 * @public
 * @param {Object} entry - Objects containing information about a directory or file.
 * @param {String} cwd - Directory to start from.
 * @returns {Promise}
 */
module.exports = function(entry, cwd) {

	return new Promise((resolve, reject) => {

		const name     = get.name(entry)
		const contents = get.contents(entry)
		const encoding = get.encoding(entry)
		const mode     = get.mode(entry)
		const flag     = get.flag(entry)

		const absolutePath = path.join(cwd, name)

		if (isDirectory(entry)===true) {

			// Create folder recursively or use existing and
			// run writeStructure again for the content of the directory
			return writeDirectory(absolutePath, mode)
				.then(() => writeStructure(contents, absolutePath))
				.then(resolve, reject)

		}

		if (isFile(entry)===true) {

			// Create file with content
			return writeFile(absolutePath, contents, encoding, mode, flag)
				.then(resolve, reject)

		}

		throw new Error(`Unknown entry type for entry with the name '${ name }'`)

	})

}