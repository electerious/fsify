import del from 'del'
import slash from 'slash'

/**
 * Tries to delete directories and files, but won't throw an error when something fails.
 *
 * @param {?Array} entriesToDelete - Directories and files to delete.
 * @param {boolean} force - Allow deleting the current working directory and outside.
 * @returns {Array} deletedEntries - Deleted directories and files.
 */
export default function cleanup(entriesToDelete = [], force) {
  // Convert Windows backslash paths to slash paths,
  // because backward slashes aren't supported in glob pattern.
  const patternsToDelete = entriesToDelete.map(slash)

  return del.sync(patternsToDelete, {
    force,
  })
}
