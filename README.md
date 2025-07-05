# fsify

![Build](https://github.com/electerious/fsify/workflows/Build/badge.svg)

Convert an array of objects into a persistent or temporary directory structure.

## Contents

- [Description](#description)
- [Install](#install)
- [Usage](#usage)
  - [Structure with content](#structure-with-content)
  - [Deeply nested structure](#deeply-nested-structure)
  - [Temporary structure in existing directory](#temporary-structure-in-existing-directory)
  - [Temporary structure with manual cleanup](#temporary-structure-with-manual-cleanup)
  - [Structure from `tree`](#structure-from-tree)
- [API](#api)
- [Instance API](#instance-api)
- [Structure](#structure)
  - [Directory](#directory)
  - [File](#file)

## Description

`fsify` creates a persistent or temporary directory structure from an array of objects. It's like the opposite of the Linux and Unix `tree` command.

## Install

```bash
npm install fsify
```

## Usage

### Structure with content

A structure is an array of objects that represents a directory structure. Each object must contain information about a directory or file.

```
.
├── dirname
│   └── filename
└── filename
```

```js
import fsify, { DIRECTORY, FILE } from 'fsify'

const structure = [
  {
    type: DIRECTORY,
    name: 'dirname',
    contents: [
      {
        type: FILE,
        name: 'filename',
        contents: 'data',
      },
    ],
  },
  {
    type: FILE,
    name: 'filename',
    contents: 'data',
  },
]

fsify()(structure)
```

### Deeply nested structure

Structures can be nested to any depth. The following example creates a directory structure with two directories and a file in the innermost directory.

```
.
└── dirname
    └── dirname
        └── filename
```

```js
import fsify, { DIRECTORY, FILE } from 'fsify'

const structure = [
  {
    type: DIRECTORY,
    name: 'dirname',
    contents: [
      {
        type: DIRECTORY,
        name: 'dirname',
        contents: [
          {
            type: FILE,
            name: 'filename',
          },
        ],
      },
    ],
  },
]

fsify()(structure)
```

### Temporary structure in existing directory

Temporary structures can be created with `persistent` set to `false`. This will create a temporary structure that is removed when the process exits.

```
dirname/
└── filename
```

```js
import fsify, { FILE } from 'fsify'

const structure = [
  {
    type: FILE,
    name: 'filename',
  },
]

fsify({
  cwd: 'dirname/',
  persistent: false,
})(structure)
```

### Temporary structure with manual cleanup

Temporary structures can be cleaned up manually by calling the `cleanup` method on the instance. This is useful if you want to create a temporary structure and remove it before the process exits. The cleanup happens synchronously.

```
dirname/
└── filename
```

```js
import fsify, { FILE } from 'fsify'

const structure = [
  {
    type: FILE,
    name: 'filename',
  },
]

const instance = fsify({
  persistent: false,
})

await instance(structure)
instance.cleanup()
```

### Structure from `tree`

`tree` is a Linux and Unix command that lists the contents of directories in a tree-like format. It's a helpful CLI to view the structure of your file system.

```
tree -J --noreport ./* > structure.json
```

```js
import fsify from 'fsify'
import structure from './structure.json' assert { type: 'json' }

fsify()(structure)
```

## API

### Usage

```js
import fsify from 'fsify'

const instance = fsify()
```

```js
import fsify from 'fsify'

const instance = fsify({
  cwd: process.cwd(),
  persistent: true,
  force: false,
})
```

### Parameters

- `options` `{?Object}` Options.
  - `cwd` `{?String}` Custom relative or absolute path. Defaults to `process.cwd()`.
  - `persistent` `{?Boolean}` Keep directories and files even when the process exists. Defaults to `true`.
  - `force` `{?Boolean}` Allow deleting the current working directory and outside. Defaults to `false`.

### Returns

- `{Function}({?Array})` [fsify instance](#instance-api).

## Instance API

### Usage

```js
import fsify, { FILE } from 'fsify'

const structure = [
  {
    type: FILE,
    name: 'filename',
  },
]

const instance = fsify()
const parsedStructure = instance(structure)
```

### Parameters

- `structure` `{?Array}` Array of objects containing information about a directory or file.

### Returns

- `{Promise<Array>}` A promise that resolves a structure. Equal to the input structure, but parsed and with a absolute path as the name.

## Structure

A structure is an array of objects that represents a directory structure. Each object must contain information about a directory or file.

The structure …

```
.
├── dirname
│   └── filename
└── filename
```

… is equal to …

```js
import { DIRECTORY, FILE } from 'fsify'

const structure = [
  {
    type: DIRECTORY,
    name: 'dirname',
    contents: [
      {
        type: FILE,
        name: 'filename',
        contents: 'data',
      },
    ],
  },
  {
    type: FILE,
    name: 'filename',
    contents: 'data',
  },
]
```

### Directory

A directory must have the `type` of a directory and a `name`. It can also contain another nested structure in its `contents` and a `mode`.

```js
import { DIRECTORY } from 'fsify'

const directory = {
  type: DIRECTORY,
  name: 'dirname',
  mode: 0o777,
  contents: [],
}
```

### File

A file must have the `type` of a file and a `name`. It can also contain `contents` (data of the file). `encoding`, `mode` and `flag` will be passed directly to `fs.writeFile`.

```js
import { FILE } from 'fsify'

const file = {
  type: FILE,
  name: 'filename',
  contents: 'data',
  encoding: 'utf8',
  mode: 0o666,
  flag: 'w',
}
```
