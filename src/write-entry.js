import get from './get.js'
import writeDirectory from './writeDirectory.js'
import writeFile from './writeFile.js'

/**
 * Writes an entry as directory or file.
 *
 * @param {object} entry - Objects containing information about a directory or file.
 * @param {Function} writeStructure - Function that converts an array into a directory structure.
 * @returns {Promise<object>} Original entry passed to the function.
 */
export default async function writeEntry(entry, writeStructure) {
  const { name, contents, encoding, mode, flag, isDirectory, isFile } = get(entry)

  if (isDirectory === true) {
    await writeDirectory(name, mode)
    await writeStructure(contents, name)

    return entry
  }

  if (isFile === true) {
    await writeFile(name, contents, encoding, mode, flag)

    return entry
  }

  throw new Error(`Unknown entry type for entry with the name '${name}'`)
}
