'use strict'

const del = require('del')

/**
 * Tries to delete files and folders, but won't throw an error when something fails.
 * @public
 * @param {?Array} entriesToDelete - Files and folders to delete.
 */
module.exports = function(entriesToDelete = []) {

	del.sync(entriesToDelete)

}