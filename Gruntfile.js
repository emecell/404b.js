module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
			uglify: {
				options: {},
				build: {
					src: "lib/404b.js",
					dest: 'dist/404b.min.js'
				}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify']);
};