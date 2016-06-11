// --------------------
// fs-extra-promise
// --------------------

// modules
var fs = require('fs-extra'),
	Promise = require('bluebird');

// exports

/**
 * Factory to create promisified version of fs-extra.
 * Adds promisified methods for all async methods
 * e.g. `fs.readFile(path, cb)` becomes `fs.readFileAsync(path)`
 * All original methods of `fs` and `fs-extra` modules are left untouched.
 * NB does not mutate `fs-extra` module - returns a new instance with extra methods added.
 *
 * @param {Object} fs - `fs-extra` module
 * @param {Object} Promise - Bluebird implementation to use
 * @returns {Object} - `fsExtra` with promisified methods added
 */
var factory = function(fs, Promise) {
	// clone fs-extra
	var fsOriginal = fs;
	fs = {};
	for (var methodName in fsOriginal) {
		fs[methodName] = fsOriginal[methodName];
	}

	// extend fs with isDirectory and isDirectorySync methods
	fs.isDirectory = function(path, callback) {
		fs.stat(path, function(err, stats) {
			if (err) return callback(err);

			callback(null, stats.isDirectory());
		});
	};

	fs.isDirectorySync = function(path) {
		return fs.statSync(path).isDirectory();
	};

	// promisify all methods
	// (except those ending with 'Sync', classes and various methods which do not use a callback)
	var method;
	for (methodName in fs) {
		method = fs[methodName];

		if (typeof method != 'function') continue;
		if (methodName.slice(-4) == 'Sync') continue;
		if (methodName.match(/^[A-Z]/)) continue;
		if (['exists', 'watch', 'watchFile', 'unwatchFile', 'createReadStream'].indexOf(methodName) != -1) continue;

		fs[methodName + 'Async'] = Promise.promisify(method);
	}

	// create fs.existsAsync()
	// fs.exists() is asynchronous but does not call callback with usual node (err, result) signature - uses just (result)
	fs.existsAsync = function(path) {
		return new Promise(function(resolve) {
			fs.exists(path, function(exists) {
				resolve(exists);
			});
		});
	};

	// use methods to set Promise used internally (e.g. could use bluebird-extra module)
	// and version of `fs-extra` being promisified

	/**
	 * Returns new instance of `fs-extra-promise` using the Promise implementation provided.
	 * @param {Object} Promise - Promise implementation to use
	 * @returns {Object} - Promisified `fs-extra`
	 */
	fs.usePromise = function(Promise) {
		return factory(fsOriginal, Promise);
	};

	/**
	 * Returns new instance of `fs-extra-promise` using the `fs` implementation provided.
	 * @param {Object} fs - Version of `fs-extra` to use
	 * @returns {Object} - Promisified `fs-extra`
	 */
	fs.useFs = function(fs) {
		return factory(fs, Promise);
	};

	// return fs
	return fs;
};

// export fs promisified with bluebird
module.exports = factory(fs, Promise);
