import isPlainObj from 'is-plain-obj'
import { DIRECTORY, FILE } from './index.js'

/**
 * Parses an entry.
 *
 * @param {object} entry - An object that represents a directory or file.
 * @returns {object} entry - Parsed entry.
 */
export default function get(entry) {
  if (!isPlainObj(entry)) {
    throw new Error(`Each entry of 'structure' must be an object`)
  }

  const { name, type, contents, mode, encoding, flag } = entry
  if (typeof name !== 'string') {
    throw new TypeError(`Each directory and file must have a 'name'`)
  }

  const isDirectory = type === DIRECTORY
  const isFile = type === FILE
  if (!isDirectory && !isFile) {
    throw new Error(`Each entry must have a known 'type'`)
  }

  return {
    name,
    type,
    contents,
    mode,
    encoding,
    flag,
    isDirectory,
    isFile,
  }
}
