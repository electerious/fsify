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

	it('should reject when structure is not an array', function() {

		return index({}).catch((err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should reject when opts is not an object', function() {

		return index([], []).catch((err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should do nothing when called without arguments', function() {

		return index()

	})

	it('should write a file with contents', function() {

		const structure = [
			{
				type: index.FILE,
				name: randomString(),
				contents: randomString()
			}
		]

		return index(structure).then((_structure) => {

			return pify(fs.readFile)(_structure[0].name, 'utf8')

		}).then((data) => {

			assert.strictEqual(data, structure[0].contents)

		})

	})

	it('should return an array where each entry is an absolute path', function() {

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

		return index(structure).then((_structure) => {

			assert.isArray(_structure)
			assert.isTrue(path.isAbsolute(_structure[0].name))
			assert.isTrue(path.isAbsolute(_structure[1].name))
			assert.isTrue(path.isAbsolute(_structure[1].contents[0].name))

		})

	})

	it('should use the process cwd as its cwd', function() {

		const structure = [
			{
				type: index.FILE,
				name: randomString()
			}
		]

		return index(structure).then((_structure) => {

			assert.strictEqual(path.resolve(process.cwd(), structure[0].name), _structure[0].name)

		})

	})

	it('should use a custom relative cwd as its cwd', function() {

		const structure = [
			{
				type: index.FILE,
				name: randomString()
			}
		]

		const cwd = randomString()

		return pify(fs.mkdir)(cwd).then(() => {

			return index(structure, { cwd })

		}).then((_structure) => {

			assert.strictEqual(path.resolve(process.cwd(), cwd, structure[0].name), _structure[0].name)

		})

	})

	it('should use a custom absolute cwd as its cwd', function() {

		const structure = [
			{
				type: index.FILE,
				name: randomString()
			}
		]

		const cwd = os.tmpdir()

		return index(structure, { cwd }).then((_structure) => {

			assert.strictEqual(path.resolve(process.cwd(), cwd, structure[0].name), _structure[0].name)

		})

	})

})