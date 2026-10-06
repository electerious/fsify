import isPathInside from 'is-path-inside'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Removes files and directories synchronously.
 *
 * @param {?Array<string>} entries - Paths to remove.
 * @param {boolean} force - Allow removing the current working directory and paths outside it.
 * @returns {Array<string>} Removed paths.
 */
export default function removeEntries(entries = [], force) {
  const cwd = process.cwd()
  const existingEntries = [...new Set(entries.map((entry) => path.resolve(entry)))].filter((entry) => {
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

  const removedEntries = existingEntries
    .toSorted((a, b) => b.localeCompare(a))
    .map((entry) => {
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

      return entry
    })

  return removedEntries.toSorted((a, b) => a.localeCompare(b))
}
