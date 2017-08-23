'use strict'

const assert = require('chai').assert
const bin = require('./../src/bin')

describe('bin()', function() {

	it('should return a function', function() {

		assert.isFunction(bin())

	})

	it('should add multiple items and return them', function() {

		const _bin = bin()

		assert.deepEqual(_bin(), [])
		assert.deepEqual(_bin(1), [ 1 ])
		assert.deepEqual(_bin(2), [ 1, 2 ])
		assert.deepEqual(_bin(3, 4), [ 1, 2, 3, 4 ])

	})

})