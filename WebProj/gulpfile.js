var gulp = require('gulp');
const exec = require('child_process').exec;
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

function ngBuild(cb) {
    console.log(' # Building Angular');
    return exec('ng build --prod=true',
        function(err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          cb(err);
        });
};

function startExpress(cb) {
    console.log(' # Starting Express');
    return exec('cd ../Backend && node app.js',
        function(err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          cb(err);
        });
}

function tsLint(cb) {
    console.log(' # TSLint');
    gulp.src([
        '**/*.js',
        '!node_modules/**',
        '!public/**',
        '!dist/**',
        '!docs/**',
    ]).pipe(eslint.format())
    cb();
};

function backendTest(cb) {
    console.log(' # Backend Testing');
    gulp.src('./../Backend/test/app.test.js').pipe(mocha());
    cb();
};

function ngCopie(cb) {
    console.log(' # Copying Dist');
    gulp.src('dist/WebCalendar/*').pipe(gulp.dest('./../Backend/public'));
    cb();
};

exports.build = gulp.series(ngBuild, ngCopie, tsLint, gulp.parallel(backendTest, startExpress));