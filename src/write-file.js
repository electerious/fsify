import fs from 'node:fs/promises'

/**
 * Asynchronously writes data to a file, replacing the file if it already exists.
 *
 * @param {string | Buffer | number} path - The file path.
 * @param {?string | Buffer | Uint8Array} data - The data to write.
 * @param {?string | null} encoding - The encoding to use.
 * @param {?number} mode - The file mode.
 * @param {?string} flag - The file flag.
 * @returns {Promise} A promise that resolves when the file has been written.
 */
export default function writeFile(path, data = '', encoding, mode, flag) {
  return fs.writeFile(path, data, {
    encoding,
    mode,
    flag,
  })
}
