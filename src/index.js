'use strict'

const path           = require('path')
const once           = require('once')
const isPlainObj     = require('is-plain-obj')
const bin            = require('./bin')()
const parseStructure = require('./parseStructure')
const writeStructure = require('./writeStructure')
const binStructure   = require('./binStructure')
const cleanup        = require('./cleanup')

/**
 * Adds a cleanup listener to the current process.
 * Function only executes once.
 * @public
 * @param {Function} bin - A function that holds all non-persistent entries.
 */
const addCleanupListener = once(function(bin) {

	process.addListener('exit', () => {

		const entriesToDelete = bin()

		cleanup(entriesToDelete)

	})

})

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
			cwd        : process.cwd(),
			persistent : true
		}, opts)

		// Support relative and absolute paths
		opts.cwd = path.resolve(process.cwd(), opts.cwd)

		// Add cleanup listener when files shouldn't be persistent
		if (opts.persistent===false) addCleanupListener(bin)

		parseStructure(structure, opts.cwd)
			.then((parsedStructure) => writeStructure(parsedStructure))
			.then((parsedStructure) => binStructure(parsedStructure, bin, opts.persistent))
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