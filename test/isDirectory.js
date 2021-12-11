'use strict'

const assert = require('chai').assert
const isDirectory = require('./../src/isDirectory')

describe('get()', function() {
	it('should not detect directory when type is not directory', function() {
		assert.isFalse(isDirectory('file'))
	})

	it('should detect directory', function() {
		assert.isTrue(isDirectory('directory'))
	})

	it('should detect directory using type from exported constant', function() {
		const DIRECTORY = require('./../src/index').DIRECTORY

		assert.isTrue(isDirectory(DIRECTORY))
	})
})