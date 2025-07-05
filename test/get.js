import assert from 'node:assert/strict'
import test from 'node:test'
import get from '../src/get.js'

test('get() should throw an error when entry is not an object', () => {
  assert.throws(
    () => {
      get([])
    },
    { message: `Each entry of 'structure' must be an object` },
  )
})

test('get() should throw an error when entry has no name', () => {
  assert.throws(
    () => {
      get({})
    },
    { message: `Each directory and file must have a 'name'` },
  )
})

test('get() should throw an error when entry has no type', () => {
  const entry = {
    name: 'name',
  }
  assert.throws(
    () => {
      get(entry)
    },
    { message: `Each entry must have a known 'type'` },
  )
})

test('get() should return a parsed entry with known fields only', () => {
  const outEntry = {
    type: 'file',
    name: 'name',
    contents: '',
    encoding: 'utf8',
    mode: 0o666,
    flag: 'w',
    isDirectory: false,
    isFile: true,
  }
  const inEntry = Object.assign({}, outEntry, {
    unknown: '',
  })
  assert.deepEqual(get(inEntry), outEntry)
})
