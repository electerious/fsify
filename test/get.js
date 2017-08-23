'use strict'

const assert = require('chai').assert
const get = require('./../src/get')

describe('get()', function() {

	it('should throw an error when entry is not an object', function() {

		assert.throws(() => {

			get([])

		}, `Each entry of 'structure' must be an object`)

	})

	it('should throw an error when entry has no name', function() {

		assert.throws(() => {

			get({})

		}, `Each directory and file must have a 'name'`)

	})

	it('should throw an error when entry has no type', function() {

		const entry = {
			name: 'name'
		}

		assert.throws(() => {

			get(entry)

		}, `Each entry must have a known 'type'`)

	})

	it('should return an parsed entry with known fields only', function() {

		const outEntry = {
			type: 'file',
			name: 'name',
			contents: '',
			encoding: 'utf8',
			mode: 0o666,
			flag: 'w',
			isDirectory: false,
			isFile: true
		}

		const inEntry = Object.assign({}, outEntry, {
			unknown: ''
		})

		assert.deepEqual(get(inEntry), outEntry)

	})

})