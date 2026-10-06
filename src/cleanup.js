import isPathInside from 'is-path-inside'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Deletes files and directories synchronously.
 *
 * @param {?Array} entriesToDelete - Directories and files to delete.
 * @param {boolean} force - Allow deleting the current working directory and outside paths.
 * @returns {Array} deletedEntries - Deleted directories and files.
 */
export default function cleanup(entriesToDelete = [], force) {
  const cwd = process.cwd()
  const existingEntries = [...new Set(entriesToDelete.map((entry) => path.resolve(entry)))].filter((entry) => {
    try {
      fs.lstatSync(entry)
      return true
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
        return false
      }

      throw error
    }
  })

  const removedEntries = existingEntries.toSorted((a, b) => b.localeCompare(a))
  for (const entry of removedEntries) {
    if (!force) {
      if (entry === cwd) {
        throw new Error(`Cannot delete the current working directory. Can be overridden with the \`force\` option.`)
      }

      if (!isPathInside(entry, cwd)) {
        throw new Error(
          `Cannot delete files/directories outside the current working directory. Can be overridden with the \`force\` option.`,
        )
      }
    }

    fs.rmSync(entry, {
      recursive: true,
      force: true,
    })
  }

  return removedEntries.toSorted((a, b) => a.localeCompare(b))
}
