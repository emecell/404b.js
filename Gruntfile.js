module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {},
			build: {
				src: "lib/404b.js",
				dest: 'dist/404b.min.js'
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'lib/**/*.js'],
			options: {
				globals: {
					console: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'uglify']);
};