'use strict'

const path           = require('path')
const get            = require('./get')
const isDirectory    = require('./isDirectory')
const isFile         = require('./isFile')
const writeDirectory = require('./writeDirectory')
const writeFile      = require('./writeFile')

module.exports = function convert(structure = [], cwd) {

	return new Promise((resolve, reject) => {

		structure.forEach((entry) => {

			const name     = get.name(entry)
			const contents = get.contents(entry)
			const encoding = get.encoding(entry)
			const mode     = get.mode(entry)
			const flag     = get.flag(entry)

			const absolutePath = path.join(cwd, name)

			if (isDirectory(entry)===true) {

				// Create folder recursively or use existing and
				// run convert again for the content of the directory
				return writeDirectory(absolutePath, mode)
					.then(() => convert(contents, absolutePath))
					.then(resolve, reject)

			}

			if (isFile(entry)===true) {

				// Create file with content
				return writeFile(absolutePath, contents, encoding, mode, flag)
					.then(resolve, reject)

			}

			throw new Error(`Unknown entry type for entry with the name '${ name }'`)

		})

	})

}