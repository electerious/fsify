'use strict'

const fs = require('fs').promises

/**
 * Asynchronously writes data to a file, replacing the file if it already exists.
 * @public
 * @param {String|Buffer|Integer} path
 * @param {?String|Buffer|Uint8Array} data
 * @param {?String|Null} encoding
 * @param {?Integer} mode
 * @param {?String} flag
 * @returns {Promise}
 */
module.exports = function(path, data = '', encoding, mode, flag) {

	return fs.writeFile(path, data, {
		encoding,
		mode,
		flag
	})

}