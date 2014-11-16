// --------------------
// fs-extra-promise
// --------------------

// modules
var fs = require('fs-extra'),
	Promise = require('bluebird');

// exports
module.exports = fs;

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
for (var name in fs) {
	method = fs[name];
	
	if (typeof method != 'function') continue;
	if (name.slice(-4) == 'Sync') continue;
	if (name.match(/^[A-Z]/)) continue;
	if (['exists', 'watch', 'watchFile', 'unwatchFile', 'createReadStream'].indexOf(name) != -1) continue;
	
	fs[name + 'Async'] = Promise.promisify(method);
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

// expose Promise object so it can be augmented (e.g. by using bluebird-extra module)
fs.Promise = Promise;
