'use strict';


module.exports = function(grunt){
	grunt.initConfig({
		mochaTest: {
			options: {
				reporter: 'spec',
				require: [
				'server.js',
				function() {
					require('mongoose').connection.once('open', function() {});
				}]
			},
			src: [
			'banks/*/server/tests/*.js',
			'panel/*/server/tests/*.js'
			]
		},
	});

	// Carregando todos os módulos
	require('load-grunt-tasks')(grunt);


	// Criando tarefa default. 'grunt'
	grunt.registerTask('test', ['mochaTest']);
};