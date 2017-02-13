'use strict'

module.exports = {}

module.exports.name = (obj) => {

	const name = obj.name

	if (typeof obj.name!=='string') throw new Error(`Every directory and file must have a 'name'`)

	return name

}

module.exports.type = (obj) => obj.type

module.exports.contents = (obj) => obj.contents || obj.content

module.exports.mode = (obj) => obj.mode

module.exports.encoding = (obj) => obj.encoding

module.exports.flag = (obj) => obj.flag