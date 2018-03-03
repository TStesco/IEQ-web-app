/* eslint-disable camelcase, global-require, no-sync */

'use strict';

const LessPluginAutoprefix = require('less-plugin-autoprefix');
const LessPluginCleanCSS = require('less-plugin-clean-css');

const path = require('path');
const pathmodify = require('pathmodify');
const pkg = require('./package.json');

const ENV_IS_PROD = process.env.NODE_ENV === 'production';

module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
  })({
    customTasksDir: 'tasks',
  });

  const cssAssetsGlob = 'assets/css/*.less';
  const jsAssetsGlob = 'assets/js/**/*.@(main|mount).js';
  const jsModulesGlob = 'assets/js/**/*.js';

  const cssAssets = grunt.file.expand(cssAssetsGlob);
  const jsAssets = grunt.file.expand(jsAssetsGlob);

  const jsModules = new Map();

  grunt.initConfig({
    symlink: {
      all: {
        files: {
          'node_modules/api': 'api',
          'node_modules/config': 'config',
          'node_modules/logger.js': 'logger.js',
        },
      },
    },

    lesslint: {
      all: ['assets/css/**/*.less', '!assets/css/common.less', '!assets/css/vendor/*.less', 'assets/css/**/*.css'],
      options: {
        csslint: {
          csslintrc: 'assets/css/.csslintrc',
        },
        less: {
          sourceMap: false,
          outputSourceFiles: false,
        },
      },
    },

    eslint: {
      all: ['*.js', '@(api|assets|config|tasks|test)/**/*.js'],
      options: {
        cache: true,
        cacheLocation: 'node_modules/.eslintcache',
      },
    },

    less: {
      all: {
        files: cssAssets.map(src => (
          {src, dest: src.replace('assets', '_static').replace('.less', '.css')}
        )),
        options: {
          ieCompat: false,
          plugins: [
            new LessPluginAutoprefix({browsers: ['last 3 versions'], remove: false}),
          ].concat(ENV_IS_PROD ? new LessPluginCleanCSS({advanced: true, aggressiveMerging: false}) : []),
          sourceMap: !ENV_IS_PROD,
          sourceMapFileInline: !ENV_IS_PROD,
          outputSourceFiles: !ENV_IS_PROD,
        },
      },
    },

    browserify: {
      all: {
        src: jsAssets,
        dest: '_static/js/common.js',
        options: {
          browserifyOptions: {
            debug: !ENV_IS_PROD,
          },
          plugin: [
            ['pathmodify', {
              mods: grunt.file.expand(jsModulesGlob).map(file => {
                const moduleName = path.basename(file, '.js');
                const existingFile = jsModules.get(moduleName);
                if (existingFile) {
                  grunt.fail.fatal(
                    `Multiple JS modules called: ${moduleName}\n  -> ${file}\n  -> ${existingFile}`
                  );
                }
                if (pkg.dependencies[moduleName]) {
                  grunt.fail.fatal(
                    `JS module conflicts with installed dependency: ${moduleName}\n  -> ${file}`
                  );
                }
                jsModules.set(moduleName, file);
                return pathmodify.mod.id(moduleName, __dirname + '/' + file);
              }).concat([
                pathmodify.mod.id('React', 'react'),
                pathmodify.mod.id('ReactDOM', 'react-dom'),
              ]),
            }],
            ['factor-bundle', {
              outputs: jsAssets.map(src => {
                const dest = src.replace('assets', '_static');
                const destDir = path.dirname(dest);
                grunt.file.mkdir(destDir);
                return dest;
              }),
            }],
          ],
          transform: [
            ['babelify', {
              presets: ['es2015', 'react'],
              sourceMaps: false,
            }],
            'envify',
          ],
          watch: true,
        },
      },
    },

    uglify: {
      options: {
        banner: '/*! (c) 2016 Atmena */',
        screwIE8: true,
      },
      main: {
        files: [{
          expand: true,
          cwd: '_static/js',
          src: '**/*.js',
          dest: '_static/js',
        }],
      },
    },

    sync: {
      assets: {
        files: [{
          cwd: 'assets',
          src: ['**/*.*', '!**/*.@(js|less)'],
          dest: '_static',
        }],
        failOnError: true,
        ignoreInDest: [
          ...jsAssets.map(src => src.replace('assets/', '')),
          ...cssAssets.map(src => src.replace('assets/', '').replace('.less', '.css')),
          'js/common.js',
          '{js,css}',
          '@(js|css)/**/*([^.])', // Match directories (for some reason "@(js|css)/**/" won't work)
        ],
        updateAndDelete: true,
        verbose: true,
      },
    },

    chokidar: { // watch
      express: {
        files: ['@(app|logger).js', '@(api|config)/**/*.js'],
        tasks: 'express:dev',
        options: {
          livereload: true,
          spawn: false,
        },
      },
      addOrUnlinkJSOrCSS: {
        files: [jsModulesGlob, cssAssetsGlob],
        tasks: ['express:dev:stop', 'exit'],
        options: {
          event: ['add', 'unlink'],
          spawn: false,
        },
      },
      css: {
        files: 'assets/css/**/*.less',
        tasks: 'build:css',
        options: {
          event: 'change',
        },
      },
      assets: {
        files: ['assets/**', '!assets/**/*.@(js|less)'],
        tasks: 'sync',
      },
      triggerReload: {
        files: ['_static/@(css|fonts)/**/*.*', '_static/js/common.js', 'views/**/*.ejs'],
        options: {
          livereload: true,
          spawn: false,
        },
      },
    },

    shell: {
      dev: {
        command: 'grunt dev:internal',
        options: {
          callback: (err, stdout, stderr, cb) => {
            if (err) throw err;
            grunt.task.run('shell');
            cb();
          },
        },
      },
    },

    mkdir: {
      logs: {
        options: {
          create: ['_logs'],
        },
      },
    },

    env: {
      js: {
        add: {
          NODE_ENV: 'development',
        },
      },
      prod: {
        NODE_ENV: 'production',
        WWW_ACCESS_LOG: __dirname + '/_logs/access-production.log',
        WWW_APP_LOG: __dirname + '/_logs/app-production.log',
      },
      test: {
        NODE_ENV: 'test',
        WWW_ACCESS_LOG: __dirname + '/_logs/access-test.log',
        WWW_APP_LOG: __dirname + '/_logs/app-test.log',
      },
    },

    express: {
      options: {
        script: 'app.js',
        port: 8080,
      },
      dev: {
        options: {
          node_env: 'development',
        },
      },
      prod: {
        options: {
          background: false,
          node_env: 'production',
        },
      },
    },
  });

  grunt.registerTask('lint', ['lesslint', 'eslint']);
  grunt.registerTask('build:css', ['less']);
  grunt.registerTask('build:js', ['env:js', 'browserify', 'wait:50'].concat(ENV_IS_PROD ? 'uglify' : []));
  grunt.registerTask('build:assets', ['sync']);
  grunt.registerTask('build', ['build:css', 'build:js', 'build:assets']);
  grunt.registerTask('dev:internal', ['build', 'express:dev', 'chokidar']);
  grunt.registerTask('dev', ['shell']);
  grunt.registerTask('test', ['mkdir:logs', 'env:test']);
  grunt.registerTask('prod', ['mkdir:logs', 'env:prod', 'build', 'express:prod']);
  grunt.registerTask('ci', ['env:prod', 'build', 'lint', 'test']);
  grunt.registerTask('default', ['lint', 'test']);
};
