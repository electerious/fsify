import path from 'node:path'
import isPathInside from 'is-path-inside'
import get from './get.js'

/**
 * Parses an entry (directory or file).
 * @public
 * @param {Object} entry - Objects containing information about a directory or file.
 * @param {String} cwd - Directory to start from.
 * @param {Function} parseStructure - Function that parses an array that represents a directory structure.
 * @returns {Promise<Object>} Parsed entry.
 */
export default async function parseEntry(entry, cwd, parseStructure) {
  const { name, contents, isDirectory, isFile } = get(entry)

  // Resolve join to get rid of a leading slash that might occur
  const absolutePath = path.resolve(path.join(cwd, name))

  if (absolutePath === cwd) {
    throw new Error(`Entry name points to the same path as the surrounding structure`)
  }

  if (!isPathInside(absolutePath, cwd)) {
    throw new Error(`Entry name points to a path outside the cwd`)
  }

  if (isDirectory === true) {
    if (contents != null && Array.isArray(contents) === false) {
      throw new Error(`Entry type is 'directory' and 'contents' must be an array, null or undefined`)
    }

    return {
      ...entry,
      name: absolutePath,
      contents: await parseStructure(contents, absolutePath),
    }
  }

  if (isFile === true) {
    if (Array.isArray(contents) === true) {
      throw new Error(`Entry type is 'file', but 'contents' is an array and should be a string or a buffer`)
    }

    return {
      ...entry,
      name: absolutePath,
    }
  }

  throw new Error(`Unknown entry type for entry with the name '${name}'`)
}
