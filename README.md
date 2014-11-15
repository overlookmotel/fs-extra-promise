# fs-extra-promise.js

# Node file system library and fs-extra module promisified with bluebird

## Current status

[![Build Status](https://secure.travis-ci.org/overlookmotel/fs-extra-promise.png?branch=master)](http://travis-ci.org/overlookmotel/fs-extra-promise)
[![Dependency Status](https://david-dm.org/overlookmotel/fs-extra-promise.png)](https://david-dm.org/overlookmotel/fs-extra-promise)

API is stable. No tests at present but it seems to work fine!

## Usage

This module is a drop-in replacement for the [native node file system module](http://nodejs.org/api/fs.html) and the augmented [fs-extra](https://www.npmjs.org/package/fs-extra) module.

Additionally, it creates promisified versions of all fs's and fs-extra's async methods, using [bluebird](https://www.npmjs.org/package/bluebird). These methods are named the same as the original fs/fs-extra methods with 'Async' added to the end of the methods.

So instead of:

	var fs = require('fs');
	fs.readFile(path, function(err, data) {
		console.log(data);
	});

You can now:

	var fs = require('fs-extra-promise');
	fs.readFileAsync(path).then(function(data) {
		console.log(data);
	});

All original fs and fs-extra methods are included unmodified.

### isDirectory() methods

For convenience, additional methods `isDirectory()`, `isDirectorySync()` and `isDirectoryAsync()` are provided.

These are are shortcuts for doing `fs.stat()` followed by running `isDirectory()` on the result returned by `stat()`.

## Tests

Use `npm test` to run the tests.

There aren't any tests at present, except for running jshint on the code.

## Changelog

See changelog.md

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookmotel/fs-extra-promise/issues
