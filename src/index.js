'use strict'

const path           = require('path')
const once           = require('once')
const isPlainObj     = require('is-plain-obj')
const parseStructure = require('./parseStructure')
const writeStructure = require('./writeStructure')
const binStructure   = require('./binStructure')
const cleanup        = require('./cleanup')

/**
 * Creates a new instance of fsify. Each instance has its own bin to make testing easier.
 * @public
 * @param {?Object} opts - Options.
 * @returns {Function}
 */
module.exports = function(opts = {}) {

	const bin = require('./bin')()

	/**
	 * Converts an object into a persistent or temporary directory structure.
	 * @param {?Array} structure - Array of objects containing information about a directory or file.
	 * @returns {Promise} Returns the following properties if resolved: {Array}.
	 */
	const main = function(structure = []) {

		return new Promise((resolve, reject) => {

			if (Array.isArray(structure)===false) {
				throw new Error(`'structure' must be an array`)
			}

			parseStructure(structure, opts.cwd)
				.then((parsedStructure) => writeStructure(parsedStructure))
				.then((parsedStructure) => binStructure(parsedStructure, bin, opts.persistent))
				.then(resolve, reject)

		})

	}

	/**
	 * Triggers a cleanup.
	 * @returns {Array} deletedEntries - Deleted directories and files.
	 */
	main.cleanup = function() {

		const entriesToDelete = bin()

		return cleanup(entriesToDelete, opts.force)

	}

	/**
	 * Constants for the structure.
	 * We don't use symbols for the constants as it should still be possible
	 * to copy, paste and use the JSON output of `tree`.
	 */
	main.DIRECTORY = module.exports.DIRECTORY
	main.FILE      = module.exports.FILE

	if (isPlainObj(opts)===false) {
		throw new Error(`'opts' must be an object`)
	}

	opts = Object.assign({
		cwd        : process.cwd(),
		persistent : true,
		force      : false
	}, opts)

	// Support relative and absolute paths
	opts.cwd = path.resolve(opts.cwd)

	// Add cleanup listener when files shouldn't be persistent
	if (opts.persistent===false) process.addListener('exit', main.cleanup)

	return main

}

/**
 * Constants for the structure.
 * We don't use symbols for the constants as it should still be possible
 * to copy, paste and use the JSON output of `tree`.
 * @public
 */
module.exports.DIRECTORY = 'directory'
module.exports.FILE      = 'file'