import writeEntry from './writeEntry.js'

/**
 * Converts an array into a directory structure.
 *
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @returns {Promise<Array>} Original structure passed to the function.
 */
export default function writeStructure(structure = []) {
  const query = structure.map((entry) => writeEntry(entry, writeStructure))
  return Promise.all(query)
}
