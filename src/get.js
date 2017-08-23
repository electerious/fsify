'use strict'

const isPlainObj = require('is-plain-obj')
const isDirectory = require('./isDirectory')
const isFile = require('./isFile')

/**
 * Parses an entry.
 * @public
 * @param {Object} entry - An object that represents a directory or file.
 */
module.exports = function(entry) {

	if (isPlainObj(entry)===false) {
		throw new Error(`Each entry of 'structure' must be an object`)
	}

	const { name, type, contents, mode, encoding, flag } = entry

	if (typeof name!=='string') {
		throw new Error(`Each directory and file must have a 'name'`)
	}

	const _isDirectory = isDirectory(type)
	const _isFile = isFile(type)

	if (_isDirectory===false && _isFile===false) {
		throw new Error(`Each entry must have a known 'type'`)
	}

	return {
		name: name,
		type: type,
		contents: contents,
		mode: mode,
		encoding: encoding,
		flag: flag,
		isDirectory: _isDirectory,
		isFile: _isFile
	}

}