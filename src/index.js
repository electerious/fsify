'use strict'

const path           = require('path')
const isPlainObj     = require('is-plain-obj')
const parseStructure = require('./parseStructure')
const writeStructure = require('./writeStructure')

/**
 * Converts an object into a persistent or temporary directory structure.
 * @public
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @param {?Object} opts - Optional options.
 * @returns {Promise} Returns the following properties if resolved: {Array}.
 */
module.exports = function(structure = [], opts = {}) {

	return new Promise((resolve, reject) => {

		if (Array.isArray(structure)===false) {
			throw new Error(`'structure' must be an array`)
		}

		if (isPlainObj(opts)===false && opts!=null) {
			throw new Error(`'opts' must be an object, null or undefined`)
		}

		opts = Object.assign({
			cwd: process.cwd()
		}, opts)

		// Support relative and absolute paths
		opts.cwd = path.resolve(process.cwd(), opts.cwd)

		parseStructure(structure, opts.cwd)
			.then((parsedStructure) => writeStructure(parsedStructure))
			.then(resolve, reject)

	})

}

/**
 * Constants for the structure.
 * We don't use symbols for the constants as it should still be possible
 * to copy, paste and use the JSON output of `tree`.
 * @public
 */
module.exports.DIRECTORY = 'directory'
module.exports.FILE      = 'file'