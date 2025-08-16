import parseEntry from './parse-entry.js'

/**
 * Parses an array that represents a directory structure.
 *
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @param {string} cwd - Directory to start from.
 * @returns {Promise<Array>} Parsed structure.
 */
export default function parseStructure(structure = [], cwd) {
  const query = structure.map((entry) => parseEntry(entry, cwd, parseStructure))
  return Promise.all(query)
}
