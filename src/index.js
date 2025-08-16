import isPlainObj from 'is-plain-obj'
import path from 'node:path'
import cleanup from './cleanup.js'
import flatten from './flatten.js'
import parseStructure from './parse-structure.js'
import writeStructure from './write-structure.js'

/**
 * Creates a new instance of fsify. Each instance has its own bin to make testing easier.
 *
 * @param {?object} options - Options.
 * @returns {Function} A function that can be called with a structure to create files and directories.
 */
export default function fsify(options = {}) {
  if (!isPlainObj(options)) {
    throw new Error(`'options' must be an object, null or undefined`)
  }

  let entriesToDelete = []

  /**
   * Converts an object into a persistent or temporary directory structure.
   *
   * @param {?Array} structure - Array of objects containing information about a directory or file.
   * @returns {Promise<Array>} Parsed structure.
   */
  const instance = async function (structure = []) {
    if (Array.isArray(structure) === false) {
      throw new TypeError(`'structure' must be an array`)
    }

    const parsedStructure = await parseStructure(structure, options.cwd)
    const writtenStructure = await writeStructure(parsedStructure)

    if (options.persistent === false) {
      const flattenedStructure = flatten(writtenStructure)
      entriesToDelete = [...entriesToDelete, ...flattenedStructure]
    }

    return writtenStructure
  }

  /**
   * Triggers a cleanup.
   *
   * @returns {Array} deletedEntries - Deleted directories and files.
   */
  instance.cleanup = function () {
    return cleanup(entriesToDelete, options.force)
  }

  options = {
    cwd: process.cwd(),
    persistent: true,
    force: false,
    ...options,
  }

  // Support relative and absolute paths
  options.cwd = path.resolve(options.cwd)

  // Add cleanup listener when files shouldn't be persistent
  if (options.persistent === false) process.addListener('exit', instance.cleanup)

  return instance
}

/**
 * Constant for files.
 * We don't use symbols for the constants as it should still be possible
 * to copy, paste and use the JSON output of `tree`.
 */
export const FILE = 'file'

/**
 * Constant for directories.
 * We don't use symbols for the constants as it should still be possible
 * to copy, paste and use the JSON output of `tree`.
 */
export const DIRECTORY = 'directory'
