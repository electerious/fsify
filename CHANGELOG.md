# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

Internal changes and improvements.

## [6.0.1] - 2025-08-16

Internal changes and improvements.

## [6.0.0] - 2025-07-05

Modernized codebase with ESM modules, less dependencies, updated Node.js support and common code style.

### Added

- Documentation for manual cleanup of temporary structures

### Changed

- Requires Node.js version 20 or higher
- Rewritten to use ESM modules (e.g. `import fsify from 'fsify'`)
- `FILE` and `DIRECTORY` constants can now be imported from the main module (e.g. `import { FILE, DIRECTORY } from 'fsify'`)

## [5.0.0] - 2021-12-11

### Changed

- Only support Node.js 12 or newer

### Fixed

- `tree` example in README (#38)

## [4.0.2] - 2021-02-28

### Changed

- Updated README, LICENSE and dependencies

## [4.0.1] - 2020-05-10

### Fixed

- Empty file content throws error

## [4.0.0] - 2020-03-20

### Changed

- Updated dependencies
- Only support Node.js 10+
- Test with Node.js 10 and 12

## [3.0.0] - 2018-08-25

### Changed

- Improved JSDoc annotation
- Removed `prepublish` script from `package.json`
- Only support Node.js 8+

### Fixed

- Assert parameter order in tests

## [2.0.4] - 2017-08-08

### Added

- Added a changelog

### Changed

- Ignore `yarn.lock` and `package-lock.json` files
