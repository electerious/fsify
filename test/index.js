import assert from 'node:assert/strict'
import { randomUUID as uuid } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import index, { DIRECTORY, FILE } from '../src/index.js'

test('index() should return a function', () => {
  assert.strictEqual(typeof index(), 'function')
})

test('index() should reject when structure is not an array', async () => {
  const instance = index()
  await assert.rejects(() => instance({}), { message: `'structure' must be an array` })
})

test('index() should throw when options is not an object', () => {
  assert.throws(
    () => {
      index([])
    },
    { message: `'options' must be an object, null or undefined` },
  )
})

test('index() should do nothing when called without arguments', async () => {
  const instance = index()
  await instance()
})

test('index() should reject when directory name points to the current directory', async () => {
  const instance = index()
  const structure = [
    {
      type: DIRECTORY,
      name: '.',
    },
  ]
  await assert.rejects(() => instance(structure), {
    message: `Entry name points to the same path as the surrounding structure`,
  })
})

test('index() should reject when directory name resolves to the current directory', async () => {
  const instance = index()
  const structure = [
    {
      type: DIRECTORY,
      name: './dirname/../',
    },
  ]
  await assert.rejects(() => instance(structure), {
    message: `Entry name points to the same path as the surrounding structure`,
  })
})

test('index() should reject when directory is outside cwd', async () => {
  const instance = index()
  const structure = [
    {
      type: DIRECTORY,
      name: '../',
    },
  ]
  await assert.rejects(() => instance(structure), { message: `Entry name points to a path outside the cwd` })
})

test('index() should reject when file name points to the current directory', async () => {
  const instance = index()
  const structure = [
    {
      type: FILE,
      name: '.',
    },
  ]
  await assert.rejects(() => instance(structure), {
    message: `Entry name points to the same path as the surrounding structure`,
  })
})

test('index() should reject when a directory has a string as its contents', async () => {
  const instance = index()
  const structure = [
    {
      type: DIRECTORY,
      name: uuid(),
      contents: uuid(),
    },
  ]
  await assert.rejects(() => instance(structure), {
    message: `Entry type is 'directory' and 'contents' must be an array, null or undefined`,
  })
})

test('index() should reject when a file has an array as its contents', async () => {
  const instance = index()
  const structure = [
    {
      type: FILE,
      name: uuid(),
      contents: [],
    },
  ]
  await assert.rejects(() => instance(structure), {
    message: `Entry type is 'file', but 'contents' is an array and should be a string or a buffer`,
  })
})

test('index() should write a file with contents', async () => {
  const options = { persistent: false }
  const instance = index(options)
  const structure = [
    {
      type: FILE,
      name: uuid(),
      contents: uuid(),
    },
  ]
  const _structure = await instance(structure)
  const data = await fs.readFile(_structure[0].name, 'utf8')
  assert.strictEqual(data, structure[0].contents)
})

test('index() should write a directory without contents', async () => {
  const options = { persistent: false }
  const instance = index(options)
  const structure = [
    {
      type: DIRECTORY,
      name: uuid(),
    },
  ]
  const _structure = await instance(structure)
  await fs.readdir(_structure[0].name)
})

test('index() should return an array where each entry is an absolute path', async () => {
  const options = { persistent: false }
  const instance = index(options)
  const structure = [
    {
      type: FILE,
      name: uuid(),
    },
    {
      type: DIRECTORY,
      name: uuid(),
      contents: [
        {
          type: FILE,
          name: uuid(),
        },
      ],
    },
  ]
  const _structure = await instance(structure)
  assert.ok(Array.isArray(_structure))
  assert.ok(path.isAbsolute(_structure[0].name))
  assert.ok(path.isAbsolute(_structure[1].name))
  assert.ok(path.isAbsolute(_structure[1].contents[0].name))
})

test('index() should use the process cwd as its cwd', async () => {
  const options = { persistent: false }
  const instance = index(options)
  const structure = [
    {
      type: FILE,
      name: uuid(),
    },
  ]
  const _structure = await instance(structure)
  assert.strictEqual(_structure[0].name, path.resolve(structure[0].name))
})

test('index() should reuse an existing directory', async () => {
  const options = { persistent: false }
  const instance = index(options)
  const structure = [
    {
      type: DIRECTORY,
      name: uuid(),
    },
  ]
  await instance(structure)
  await instance(structure)
})

test('index() should use a custom relative cwd as its cwd', async () => {
  const options = { cwd: './test', persistent: false }
  const instance = index(options)
  const structure = [
    {
      type: FILE,
      name: uuid(),
    },
  ]
  const _structure = await instance(structure)
  assert.strictEqual(_structure[0].name, path.resolve(options.cwd, structure[0].name))
})

test('index() should use a custom absolute cwd as its cwd', async () => {
  const options = { cwd: os.tmpdir(), persistent: false, force: true }
  const instance = index(options)
  const structure = [
    {
      type: FILE,
      name: uuid(),
    },
  ]
  const _structure = await instance(structure)
  assert.strictEqual(_structure[0].name, path.resolve(options.cwd, structure[0].name))
})

test('index() should cleanup non-persistent files when cleanup triggered manually', async () => {
  const options = { persistent: false }
  const instance = index(options)
  const structure = [
    {
      type: FILE,
      name: uuid(),
    },
  ]
  await instance(structure)
  const deletedEntries = await instance.cleanup()
  assert.strictEqual(deletedEntries.length, 1)
})

test('index() should not cleanup persistent files when cleanup triggered manually', async () => {
  const instance = index()
  const structure = [
    {
      type: FILE,
      name: uuid(),
    },
  ]
  const _structure = await instance(structure)
  const deletedEntries = await instance.cleanup()
  assert.strictEqual(deletedEntries.length, 0)
  // Manual cleanup
  await fs.unlink(_structure[0].name)
})
