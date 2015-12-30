var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var del = require('del');
var exec = require('child_process').exec;

gulp.task('default', ['clean', 'test']);

gulp.task('clean', function (cb) {
    del(['lib/**/*', 'test/lib/**/*'], cb);
});

gulp.watch('src/**/*.js', ['test']);

gulp.watch('test/src/**/*.js', ['test']);

gulp.task('build', ['buildSrc', 'buildTest']);

gulp.task('buildSrc', function () {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('buildTest', function () {
    return gulp.src('test/src/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(gulp.dest('test/lib'));
});

gulp.task('test', ['build'], function (cb) {
    exec('mocha test/lib/**/*.js', {}, function (err, stdout, stderr) {
        if(stdout) {
            gutil.log(stdout);
        }
        if(stderr) {
            gutil.log(stderr);
        }
        cb();
    });
});

gulp.task('cover', ['build'], function (cb) {
    exec('npm test', {}, function (err, stdout, stderr) {
        if(stdout) {
            gutil.log(stdout);
        }
        if(stderr) {
            gutil.log(stderr);
        }
        cb();
    });
});