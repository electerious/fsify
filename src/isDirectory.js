'use strict'

const get = require('./get')

module.exports = function(obj) {

	// Get constant during fn call. Would be empty otherwise.
	const DIRECTORY = require('./index').DIRECTORY

	const type     = get.type(obj)
	const contents = get.contents(obj)

	if (type===DIRECTORY)               return true
	if (Array.isArray(contents)===true) return true

	return false

}