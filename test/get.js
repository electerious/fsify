'use strict'

const assert = require('chai').assert
const get    = require('./../src/get')

describe('get()', function() {

	it('should throw an error when entry is not an object', function() {

		assert.throws(() => {

			get([])

		})

	})

	it('should throw an error when entry has no name', function() {

		assert.throws(() => {

			get({})

		})

	})

	it('should return an parsed entry with known fields only', function() {

		const outEntry = {
			name: 'name',
			type: 'file',
			contents: '',
			mode: 0o666,
			encoding: 'utf8',
			flag: 'w'
		}

		const inEntry = Object.assign({}, outEntry, {
			unknown: ''
		})

		assert.deepEqual(get(inEntry), outEntry)

	})

})