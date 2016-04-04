var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task("bundle",function()
{
    return browserify({
        entries: "./app/main.jsx",
        debug: true
    }).transform(reactify)
    .bundle()
    .pipe(source("main.js"))
    .pipe(gulp.dest("app/dist"));
});

gulp.task("copy",["bundle"],function()
{
    return gulp.src(["app/index.html","app/style.css","app/server/server.js","app/server/snakes.R","app/server/sample.R"])
    .pipe(gulp.dest("app/dist"));
});


gulp.task("default",["copy"],function(){
   console.log("Gulp completed..."); 
});