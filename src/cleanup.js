import removeEntries from './remove-entries.js'

/**
 * Deletes files and directories synchronously.
 *
 * @param {?Array} entriesToDelete - Directories and files to delete.
 * @param {boolean} force - Allow deleting the current working directory and outside paths.
 * @returns {Array} deletedEntries - Deleted directories and files.
 */
export default function cleanup(entriesToDelete = [], force) {
  return removeEntries(entriesToDelete, force)
}
