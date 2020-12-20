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

function ngCopie(cb) {
  console.log(' # Copying Dist');
  gulp.src('dist/WebCalendar/*').pipe(gulp.dest('./../backend/public'));
  cb();
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

function startExpress() {
  var server = gls.new('./../backend/app.js');
  return server.start();
};

exports.build = gulp.series(ngBuild, ngCopie, tsLint, startExpress);