'use strict'

const os     = require('os')
const crypto = require('crypto')
const path   = require('path')
const fs     = require('fs')
const pify   = require('pify')
const assert = require('chai').assert
const index  = require('./../src/index')

const randomString = () => crypto.randomBytes(20).toString('hex')

describe('index()', function() {

	it('should return a function', function() {

		assert.isFunction(index())

	})

	it('should reject when structure is not an array', function() {

		const instance = index()

		return instance({}).catch((err) => {

			assert.strictEqual(`'structure' must be an array`, err.message)

		})

	})

	it('should throw when opts is not an object', function() {

		assert.throws(() => {

			const instance = index([])

		}, `'opts' must be an object`)

	})

	it('should do nothing when called without arguments', function() {

		const instance = index()

		return instance()

	})

	it('should reject when directory name points to the current directory', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.DIRECTORY,
				name: '.'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(`Entry name points to the same path as the surrounding structure`, err.message)

		})

	})

	it('should reject when directory name resolves to the current directory', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.DIRECTORY,
				name: './dirname/../'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(`Entry name points to the same path as the surrounding structure`, err.message)

		})

	})

	it('should reject when directory is outside cwd', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.DIRECTORY,
				name: '../'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(`Entry name points to a path outside the cwd`, err.message)

		})

	})

	it('should reject when file name points to the current directory', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: '.'
			}
		]

		return instance(structure).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(`Entry name points to the same path as the surrounding structure`, err.message)

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
				name: randomString(),
				contents: randomString()
			}
		]

		return instance(structure).then((_structure) => {

			return pify(fs.readFile)(_structure[0].name, 'utf8')

		}).then((data) => {

			assert.strictEqual(data, structure[0].contents)

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
				name: randomString()
			},
			{
				type: index.DIRECTORY,
				name: randomString(),
				contents: [
					{
						type: index.FILE,
						name: randomString()
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
				name: randomString()
			}
		]

		return instance(structure).then((_structure) => {

			assert.strictEqual(path.resolve(structure[0].name), _structure[0].name)

		})

	})

	it('should reuse an existing directory', function() {

		const opts = {
			persistent: false
		}

		const instance = index(opts)

		const structureOne = [
			{
				type: index.DIRECTORY,
				name: randomString()
			}
		]

		const structureTwo = [
			{
				type: index.DIRECTORY,
				name: structureOne[0].name
			}
		]

		return instance(structureOne).then((_structureOne) => {

			return instance(structureTwo)

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
				name: randomString()
			}
		]

		return instance(structure).then((_structure) => {

			assert.strictEqual(path.resolve(opts.cwd, structure[0].name), _structure[0].name)

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
				name: randomString()
			}
		]

		return instance(structure).then((_structure) => {

			assert.strictEqual(path.resolve(opts.cwd, structure[0].name), _structure[0].name)

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
				name: randomString()
			}
		]

		return instance(structure).then((_structure) => {

			return instance.cleanup()

		}).then((deletedEntries) => {

			assert.strictEqual(1, deletedEntries.length)

		})

	})

	it('should not cleanup persistent files when cleanup triggered manually', function() {

		const opts = {
			persistent: true
		}

		const instance = index(opts)

		const structure = [
			{
				type: index.FILE,
				name: randomString()
			}
		]

		return instance(structure).then((_structure) => {

			return {
				_structure: _structure,
				deletedEntries: instance.cleanup()
			}

		}).then(({ _structure, deletedEntries }) => {

			assert.strictEqual(0, deletedEntries.length)

			// Manual cleanup
			return pify(fs.unlink)(_structure[0].name)

		})

	})

})