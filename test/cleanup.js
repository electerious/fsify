import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import cleanup from '../src/cleanup.js'

test('cleanup() should remove exact paths recursively and return removed paths', () => {
  const directory = fs.mkdtempSync(path.join(process.cwd(), 'fsify-remove-XXXXXX-'))
  const nestedDirectory = path.join(directory, 'nested')
  const file = path.join(nestedDirectory, 'literal[*].txt')

  fs.mkdirSync(nestedDirectory)
  fs.writeFileSync(file, '')

  try {
    const removedEntries = cleanup([nestedDirectory, file, file, path.join(directory, 'missing')])

    assert.deepEqual(
      removedEntries,
      [nestedDirectory, file].toSorted((a, b) => a.localeCompare(b)),
    )
    assert.equal(fs.existsSync(nestedDirectory), false)
    assert.equal(fs.existsSync(directory), true)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

test('cleanup() should protect the current working directory and outside paths', () => {
  const currentDirectoryError = `Cannot delete the current working directory. Can be overridden with the \`force\` option.`
  const outsideDirectoryError = `Cannot delete files/directories outside the current working directory. Can be overridden with the \`force\` option.`

  assert.throws(() => cleanup([process.cwd()]), { message: currentDirectoryError })

  const outsidePath = path.dirname(process.cwd())
  const outsidePathError = outsidePath === process.cwd() ? currentDirectoryError : outsideDirectoryError

  assert.throws(() => cleanup([outsidePath]), { message: outsidePathError })
})

test('cleanup() should allow force removal outside the current working directory', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'fsify-remove-XXXXXX-'))
  const file = path.join(directory, 'file')
  fs.writeFileSync(file, '')

  try {
    assert.deepEqual(cleanup([directory], true), [directory])
    assert.equal(fs.existsSync(directory), false)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})
