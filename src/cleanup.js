'use strict'

const del = require('del')

/**
 * Tries to delete directories and files, but won't throw an error when something fails.
 * @public
 * @param {?Array} entriesToDelete - Directories and files to delete.
 * @returns {Array} deletedEntries - Deleted directories and files.
 */
module.exports = function(entriesToDelete = []) {

	return del.sync(entriesToDelete)

}