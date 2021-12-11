'use strict'

const path = require('path')
const isPlainObj = require('is-plain-obj')
const parseStructure = require('./parseStructure')
const writeStructure = require('./writeStructure')
const binStructure = require('./binStructure')
const cleanup = require('./cleanup')

/**
 * Creates a new instance of fsify. Each instance has its own bin to make testing easier.
 * @public
 * @param {?Object} options - Options.
 * @returns {Function}
 */
module.exports = function(options = {}) {

	const bin = require('./bin')()

	/**
	 * Converts an object into a persistent or temporary directory structure.
	 * @param {?Array} structure - Array of objects containing information about a directory or file.
	 * @returns {Promise<Array>} Parsed structure.
	 */
	const main = function(structure = []) {

		return new Promise((resolve, reject) => {

			if (Array.isArray(structure) === false) {
				throw new Error(`'structure' must be an array`)
			}

			parseStructure(structure, options.cwd)
				.then((parsedStructure) => writeStructure(parsedStructure))
				.then((parsedStructure) => binStructure(parsedStructure, bin, options.persistent))
				.then(resolve, reject)

		})

	}

	/**
	 * Triggers a cleanup.
	 * @returns {Array} deletedEntries - Deleted directories and files.
	 */
	main.cleanup = function() {

		const entriesToDelete = bin()

		return cleanup(entriesToDelete, options.force)

	}

	/**
	 * Constants for the structure.
	 * We don't use symbols for the constants as it should still be possible
	 * to copy, paste and use the JSON output of `tree`.
	 */
	main.DIRECTORY = module.exports.DIRECTORY
	main.FILE = module.exports.FILE

	if (isPlainObj(options) === false) {
		throw new Error(`'options' must be an object, null or undefined`)
	}

	options = Object.assign({
		cwd: process.cwd(),
		persistent: true,
		force: false
	}, options)

	// Support relative and absolute paths
	options.cwd = path.resolve(options.cwd)

	// Add cleanup listener when files shouldn't be persistent
	if (options.persistent === false) process.addListener('exit', main.cleanup)

	return main

}

/**
 * Constants for the structure.
 * We don't use symbols for the constants as it should still be possible
 * to copy, paste and use the JSON output of `tree`.
 * @public
 */
module.exports.DIRECTORY = 'directory'
module.exports.FILE = 'file'