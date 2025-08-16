import fs from 'node:fs/promises'

/**
 * Creates a new directory. Subdirectories must exist.
 * Reuses existing directories without deleting them.
 *
 * @param {string} path - Path to create.
 * @param {?string} mode - If a directory needs to be created, set the mode to this octal permission string.
 * @returns {Promise} A promise that resolves when the directory has been created.
 */
export default function writeDirectory(path, mode) {
  return fs.mkdir(path, mode).catch((error) => {
    if (error.code !== 'EEXIST') throw error
  })
}
