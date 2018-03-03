'use strict';

module.exports = function(grunt) {
  grunt.registerTask('exit', 'Exits the currently running process', () => {
    process.exit();
  });
};
