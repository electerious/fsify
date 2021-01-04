# fsify

![Build](https://github.com/electerious/fsify/workflows/Build/badge.svg)

Convert an array of objects into a persistent or temporary directory structure.

## Contents

- [Description](#description)
- [Install](#install)
- [Usage](#usage)
	- [Structure with content](#structure-with-content)
	- [Deeply nested structure](#deeply-nested-structure)
	- [Temporary file in existing directory](#temporary-file-in-existing-directory)
	- [Structure from `tree -J`](#structure-from-tree--j)
- [API](#api)
- [Instance API](#instance-api)
- [Structure](#structure)
	- [Directory](#directory)
	- [File](#file)

## Description

`fsify` creates a persistent or temporary directory structure from an array of objects. It's like the opposite of the Linux and Unix `tree` command.

## Install

```
npm install fsify
```

## Usage

### Structure with content

```
.
├── dirname
│   └── filename
└── filename
```

```js
const fsify = require('fsify')()

const structure = [
	{
		type: fsify.DIRECTORY,
		name: 'dirname',
		contents: [
			{
				type: fsify.FILE,
				name: 'filename',
				contents: 'data'
			}
		]
	},
	{
		type: fsify.FILE,
		name: 'filename',
		contents: 'data'
	}
]

fsify(structure)
	.then((structure) => console.log(structure))
	.catch((err) => console.error(err))
```

### Deeply nested structure

```
.
└── dirname
    └── dirname
        └── filename
```

```js
const fsify = require('fsify')()

const structure = [
	{
		type: fsify.DIRECTORY,
		name: 'dirname',
		contents: [
			{
				type: fsify.DIRECTORY,
				name: 'dirname',
				contents: [
					{
						type: fsify.FILE,
						name: 'filename'
					}
				]
			}
		]
	}
]

fsify(structure)
	.then((structure) => console.log(structure))
	.catch((err) => console.error(err))
```

### Temporary file in existing directory

```
dirname/
└── filename
```

```js
const fsify = require('fsify')({
	cwd: 'dirname/',
	persistent: false
})

const structure = [
	{
		type: fsify.FILE,
		name: 'filename'
	}
]

fsify(structure)
	.then((structure) => console.log(structure))
	.catch((err) => console.error(err))
```

### Structure from `tree -J`

`tree` is a Linux and Unix command that lists the contents of directories in a tree-like format. It's a helpful CLI to view the structure of your file system. The flag `-J` prints out an JSON representation of the tree. The output can be used in `fsify`.

```
tree -J > tree.json
```

```js
const fs = require('fs')
const fsify = require('fsify')()

const structure = fs.readFileSync('tree.json', 'utf8')

fsify(structure)
	.then((structure) => console.log(structure))
	.catch((err) => console.error(err))
```

## API

### Usage

```js
const fsify = require('fsify')()
```

```js
const fsify = require('fsify')({
	cwd: process.cwd(),
	persistent: true,
	force: false
})
```

### Parameters

- `opts` `{?Object}` Options.
	- `cwd` `{?String}` - Custom relative or absolute path. Defaults to `process.cwd()`.
	- `persistent` `{?Boolean}` - Keep directories and files even when the process exists. Defaults to `true`.
	- `force` `{?Boolean}` - Allow deleting the current working directory and outside. Defaults to `false`.

### Returns

- `{Function}({?Array})` [fsify instance](#instance-api).

## Instance API

### Usage

```js
const structure = [
	{
		type: fsify.FILE,
		name: 'filename'
	}
]

fsify(structure)
	.then((structure) => console.log(structure))
	.catch((err) => console.error(err))
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
│   └── filename
└── filename
```

… is equal to …

```js
[
	{
		type: fsify.DIRECTORY,
		name: 'dirname',
		contents: [
			{
				type: fsify.FILE,
				name: 'filename',
				contents: 'data'
			}
		]
	},
	{
		type: fsify.FILE,
		name: 'filename',
		contents: 'data'
	}
]
```

### Directory

A directory must have the `type` of a directory and a `name`. It can also contain another nested structure in its `contents` and a `mode`.

```js
{
	type: fsify.DIRECTORY,
	name: 'dirname',
	mode: 0o777,
	contents: []
}
```

### File

A file must have the `type` of a file and a `name`. It can also contain `contents` (data of the file). `encoding`, `mode` and `flag` will be passed directly to `fs.writeFile`.

```js
{
	type: fsify.FILE,
	name: 'filename',
	contents: 'data',
	encoding: 'utf8',
	mode: 0o666,
	flag: 'w'
}
```
