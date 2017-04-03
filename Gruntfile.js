module.exports = function(grunt) {
	// project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: ['views/**', 'public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				options: {
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					args: [],
					ignore: ['README.md', 'node_modules/**'],
					ext: 'js',
					watch: ['.'],
					debug: true,
					delay: 1000,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	// load grunt task
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.option('force', true);
	grunt.registerTask('default', ['concurrent']);
}