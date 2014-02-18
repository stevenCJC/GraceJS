/*
 * sf
 * https://github.com/Steven/sdf
 *
 * Copyright (c) 2014 Steven
 * Licensed under the MIT license.
 */



module.exports = function(grunt) {
	
	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}

	var gzip = require( "gzip-js" ),
		srcHintOptions = readOptionalJSON( "src/.jshintrc" );

	// The concatenated file won't pass onevar
	// But our modules can
	delete srcHintOptions.onevar;

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		dst: readOptionalJSON( "dist/.destination.json" ),
		
		sf: {
			all: {
				dest: "dist/grace.js",
				minimum: [
					"grace",
				],
				removeWith: {
					//ajax: [ "manipulation/_evalUrl" ],
					//callbacks: [ "deferred" ],
					//css: [ "effects", "dimensions", "offset" ],
					//sizzle: [ "css/hiddenVisibleSelectors", "effects/animatedSelector" ]
				}
			}
		},
		
		jshint: {
			
			dist: {
				src: "dist/grace.js",
				options: srcHintOptions
			}
		},
		
		watch: {
			files: [ "<%= jshint.all.src %>" ],
			tasks: "dev"
		},
		uglify: {
			all: {
				files: {
					"dist/grace.min.js": [ "dist/grace.js" ]
				},
				options: {
					preserveComments: false,
					sourceMap: "dist/grace.min.map",
					sourceMappingURL: "grace.min.map",
					report: "min",
					beautify: {
						ascii_only: true
					},
					banner: "/*! grace v<%= pkg.version %> | " +
						"(c) 2005, <%= grunt.template.today('yyyy') %> grace Foundation, Inc. | " +
						"grace.org/license */",
					compress: {
						hoist_funs: false,
						loops: false,
						unused: false
					}
				}
			},
			b: {
				files: {
					"dist/grace.js": [ "dist/grace.js" ]
				},
				options: {
					mangle:false,
					preserveComments: true,
					beautify: true,
					"ascii_only":true,
					semicolons:true,
					"preserve_line":true,
					width:80,
					"quote_keys":true,
					indent_level:4,
					compress:false,
					bracketize:true,
				}
			},
		}
	});

	// Load grunt tasks from NPM packages
	require( "load-grunt-tasks" )( grunt );

	// Integrate grace specific tasks
	grunt.loadTasks( "tasks" );

	// Short list as a high frequency watch task
	grunt.registerTask( "dev", [ "sf:*:*", "jshint" ] );

	// Default grunt
	grunt.registerTask( "default", [  "dev", "uglify" ] );
  

};
