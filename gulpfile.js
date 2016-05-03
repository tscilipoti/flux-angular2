 /* eslint strict:0, no-console:0 */
'use strict';

const gulp = require('gulp');
const fs = require('fs');
global.__package = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const lint = require('build-lint');
const test = require('build-test');
const transform = require('build-transform');

lint.registerTasks({
  glob: ['src/**/*.js', '!src/public/**/*', '!src/styles/**/*', '!src/tests/fixtures/**/*']
});

test.registerTasks({
  testGlob: ['lib/tests/**/*.[jt]s'],
  codeGlob: ['lib/**/*.js', '!lib/tests/**/*.[jt]s'],
  thresholds: {
    global: { lines: 75 }
  },
  require: './lib/tests/domSetup',
  outputDir: 'testResults/',
  tasksDependencies: ['transform']
});

transform.registerTasks({
  glob: ['**/*.[jt]s', '!styles/**/*', '!public/**/*'],
  inputDir: 'src/',
  outputDir: 'lib/'
});

/*
 * Watch for changes to files.
 */
gulp.task('watch', ['watch-lint', 'watch-transform'], function () {
  console.log('Watch is running.');
  console.log('Type ^C to stop the watch process.');
});

/*
 * Build the application.
 */
gulp.task('build', ['transform'], function () {
});
