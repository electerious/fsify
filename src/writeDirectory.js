import fs from 'node:fs/promises'

/**
 * Creates a new directory. Subdirectories must exist.
 * Reuses existing directories without deleting them.
 * @public
 * @param {String} path - Path to create.
 * @param {?String} mode - If a directory needs to be created, set the mode to this octal permission string.
 * @returns {Promise}
 */
export default function writeDirectory(path, mode) {
  return fs.mkdir(path, mode).catch((error) => {
    if (error.code !== 'EEXIST') throw error
  })
}
