import get from './get.js'

/**
 * Flattens a structure to an array that only contains the name of each entries.
 *
 * @param {?Array} structure - Array of objects containing information about a directory or file.
 * @returns {Array} flattenedStructure
 */
export default function flatten(structure = []) {
  return structure.reduce((entries, entry) => {
    const { name, contents, isDirectory } = get(entry)
    entries = [...entries, name]

    if (isDirectory === true) {
      entries = [...entries, ...flatten(contents)]
    }

    return entries
  }, [])
}
