'use strict'

const assert = require('chai').assert
const isFile = require('./../src/isFile')

describe('get()', function() {
	it('should not detect file when type is not file', function() {
		assert.isFalse(isFile('directory'))
	})

	it('should detect file', function() {
		assert.isTrue(isFile('file'))
	})

	it('should detect file using type from exported constant', function() {
		const FILE = require('./../src/index').FILE

		assert.isTrue(isFile(FILE))
	})
})