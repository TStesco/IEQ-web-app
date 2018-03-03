'use strict';

module.exports = function(grunt) {
  grunt.registerTask('wait', 'Waits for the specified number of milliseconds', function(ms) {
    const done = this.async();
    ms = +ms || 1;
    grunt.log.write('Waiting for ' + ms + ' ms...');
    setTimeout(() => {
      grunt.log.writeln('Done!');
      done();
    }, ms);
  });
};
