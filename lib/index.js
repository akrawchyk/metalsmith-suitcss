'use strict';
var path = require('path');
var debug = require('debug')('metalsmith-suitcss');
var preprocessor = require('suitcss-preprocessor');
var minimatch = require('minimatch');


/**
 * Metalsmith plugin to run files through any template in a template `dir`.
 *
 * @param {String or Object} options
 *   @property {String} files (optional)
 * @return {Function}
 */

function plugin (options) {
	options = options || {};

	return function (files, metalsmith, done) {
		options.files = options.files || '*.css';

		Object.keys(files).forEach(function (file) {
			debug('checking file: %s', file);
			if (!minimatch(file, options.files, { matchBase: true })) {
				return;
			}

			debug('preprocessing file: %s', file);
			options.source = path.join(metalsmith.source(), file);

			preprocessor(files[file].contents.toString(), options)
				.then(function(result) {
					files[file].contents = new Buffer(result.css);
					done();
				});
		});
	};
}

module.exports = plugin;
