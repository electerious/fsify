'use strict'

const isPlainObj = require('is-plain-obj')

/**
 * Parses an entry.
 * @public
 * @param {Object} entry - An object that represents a directory or file.
 */
module.exports = function(entry) {

	if (isPlainObj(entry)===false) {
		throw new Error(`Each entry of 'structure' must be an object`)
	}

	const name     = entry.name
	const type     = entry.type
	const contents = entry.contents
	const mode     = entry.mode
	const encoding = entry.encoding
	const flag     = entry.flag

	if (typeof name!=='string') {
		throw new Error(`Each directory and file must have a 'name'`)
	}

	return {
		name,
		type,
		contents,
		mode,
		encoding,
		flag
	}

}