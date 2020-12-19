var gulp = require('gulp');
const exec = require('child_process').exec;
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
var gls = require('gulp-live-server');

function ngBuild(cb) {
  console.log(' # Building Angular');
  return exec('ng build --prod=true',
    function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
};

function startExpress() {
  var server = gls.new('./../oldproject/app.js');
  return server.start();
};

function tsLint(cb) {
  console.log(' # TSLint');
  gulp.src([
    '/*.js',
    '!node_modules/',
    '!public/',
    '!dist/',
    '!docs/*',
  ]).pipe(eslint.format())
  cb();
};

function backendTest(cb) {
  console.log(' # Backend Testing');
  gulp.src('./../oldproject/test/app.test.js').pipe(mocha());
  cb();
};

function ngCopie(cb) {
  console.log(' # Copying Dist');
  gulp.src('dist/WebCalendar/*').pipe(gulp.dest('./../oldproject/public'));
  cb();
};

exports.build = gulp.series(ngBuild, ngCopie, tsLint, startExpress);