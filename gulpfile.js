var gulp = require('gulp');
var babel = require('gulp-babel');
var child_process = require('child_process');

gulp.task('default', ['build', 'test']);

gulp.watch('src/**/*.js', ['build', 'test']);

gulp.watch('test/**/*.js', ['build', 'test']);

gulp.task('build', function() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('test',['build'], function(cb) {
  child_process.exec("npm test", {}, function(err, stdout, stderr) {
        if(stdout) {
            console.log(stdout);
        }
        if(stderr) {
            console.log(stderr);
        }
        cb();
    });
});