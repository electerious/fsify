'use strict'

const util = require('util')
const os = require('os')
const path = require('path')
const fs = require('fs')
const assert = require('chai').assert
const uuid = require('uuid/v4')
const index = require('./../src/index')

describe('index()', function() {

	it('should return a function', function() {

		assert.isFunction(index())

	})

	it('should reject when structure is not an array', function() {

		const instance = index()

		return instance({}).catch((err) => {

			assert.strictEqual(err.message, `'structure' must be an array`)

		})

	})

	it('should throw when opts is not an object', function() {

		assert.throws(() => {

			index([])

		}, `'opts' must be an object, null or undefined`)

	})

	it('should do nothing when called without arguments', function() {

		const instance = index()

		return instance()

	})

	it('should reject when directory name points to the current directory', function() {

		const instance = index()

		const structure = [
			{
				type: index.DIRECTORY,
				name: '.'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Entry name points to the same path as the surrounding structure`)

		})

	})

	it('should reject when directory name resolves to the current directory', function() {

		const instance = index()

		const structure = [
			{
				type: index.DIRECTORY,
				name: './dirname/../'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Entry name points to the same path as the surrounding structure`)

		})

	})

	it('should reject when directory is outside cwd', function() {

		const instance = index()

		const structure = [
			{
				type: index.DIRECTORY,
				name: '../'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Entry name points to a path outside the cwd`)

		})

	})

	it('should reject when file name points to the current directory', function() {

		const instance = index()

		const structure = [
			{
				type: index.FILE,
				name: '.'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Entry name points to the same path as the surrounding structure`)

		})

	})

	it('should reject when a directory has a string as its contents', function() {

		const instance = index()

		const structure = [
			{
				type: index.DIRECTORY,
				name: uuid(),
				contents: uuid()
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Entry type is 'directory' and 'contents' must be an array, null or undefined`)

		})

	})

	it('should reject when a file has an array as its contents', function() {

		const instance = index()

		const structure = [
			{
				type: index.FILE,
				name: uuid(),
				contents: []
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `Entry type is 'file', but 'contents' is an array and should be a string or a buffer`)

		})

	})

	it('should write a file with contents', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: uuid(),
				contents: uuid()
			}
		]

		return instance(structure).then((_structure) => {

			return util.promisify(fs.readFile)(_structure[0].name, 'utf8')

		}).then((data) => {

			assert.strictEqual(data, structure[0].contents)

		})

	})

	it('should write a directory without contents', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.DIRECTORY,
				name: uuid()
			}
		]

		return instance(structure).then((_structure) => {

			return util.promisify(fs.readdir)(_structure[0].name)

		})

	})

	it('should return an array where each entry is an absolute path', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: uuid()
			},
			{
				type: index.DIRECTORY,
				name: uuid(),
				contents: [
					{
						type: index.FILE,
						name: uuid()
					}
				]
			}
		]

		return instance(structure).then((_structure) => {

			assert.isArray(_structure)
			assert.isTrue(path.isAbsolute(_structure[0].name))
			assert.isTrue(path.isAbsolute(_structure[1].name))
			assert.isTrue(path.isAbsolute(_structure[1].contents[0].name))

		})

	})

	it('should use the process cwd as its cwd', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: uuid()
			}
		]

		return instance(structure).then((_structure) => {

			assert.strictEqual(_structure[0].name, path.resolve(structure[0].name))

		})

	})

	it('should reuse an existing directory', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.DIRECTORY,
				name: uuid()
			}
		]

		return instance(structure).then(() => {

			return instance(structure)

		})

	})

	it('should use a custom relative cwd as its cwd', function() {

		const opts = {
			cwd: './test',
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: uuid()
			}
		]

		return instance(structure).then((_structure) => {

			assert.strictEqual(_structure[0].name, path.resolve(opts.cwd, structure[0].name))

		})

	})

	it('should use a custom absolute cwd as its cwd', function() {

		const opts = {
			cwd: os.tmpdir(),
			persistent: false,
			force: true
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: uuid()
			}
		]

		return instance(structure).then((_structure) => {

			assert.strictEqual(_structure[0].name, path.resolve(opts.cwd, structure[0].name))

		})

	})

	it('should cleanup non-persistent files when cleanup triggered manually', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: uuid()
			}
		]

		return instance(structure).then(() => {

			return instance.cleanup()

		}).then((deletedEntries) => {

			assert.strictEqual(deletedEntries.length, 1)

		})

	})

	it('should not cleanup persistent files when cleanup triggered manually', function() {

		const instance = index()

		const structure = [
			{
				type: index.FILE,
				name: uuid()
			}
		]

		return instance(structure).then((_structure) => {

			return {
				_structure: _structure,
				deletedEntries: instance.cleanup()
			}

		}).then(({ _structure, deletedEntries }) => {

			assert.strictEqual(deletedEntries.length, 0)

			// Manual cleanup
			return util.promisify(fs.unlink)(_structure[0].name)

		})

	})

})