'use strict'

const del = require('del')
const slash = require('slash')

/**
 * Tries to delete directories and files, but won't throw an error when something fails.
 * @public
 * @param {?Array} entriesToDelete - Directories and files to delete.
 * @param {Boolean} force - Allow deleting the current working directory and outside.
 * @returns {Array} deletedEntries - Deleted directories and files.
 */
module.exports = function(entriesToDelete = [], force) {
	// Convert Windows backslash paths to slash paths,
	// because backward slashes aren't supported in glob pattern.
	const patternsToDelete = entriesToDelete.map(slash)

	return del.sync(patternsToDelete, {
		force,
	})
}