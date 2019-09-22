//Подключаем модули Галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
// const postcss = require('gulp-postcss');


//Порядок подключения css файлов
// const cssFiles = [
//     './src/css/main.css'
//     // './src/css/media.css'
// ];

//Порядок подключения js файлов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];



//Таск на стили SASS
function sassCompiler() {
    return gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }))
    .pipe(cleanCSS({
        level: 2
    }))
     .pipe(sass().on('error', sass.logError))
     .pipe(sourcemaps.write())
     .pipe(gulp.dest('./src/build/minCSS'))
     .pipe(browserSync.stream());
}

//Таск на стили CSS
// function styles() {
//     //Шаблон для поиска файлов CSS 
//     // Всей файлы по шаблону '.src/css/**/*/.css'
//     return gulp.src('./src/css/main.css')
//     //Объединение файлов в один
//     // .pipe(concat('style.css'))
//     //Добавить префиксы
//     .pipe(autoprefixer({
//         browsers: ['last 3 versions'],
//         cascade: false
//     }))
//     //
//     .pipe(cleanCSS({
//         level: 2
//     }))
//     //Выходная папка для стилей 
//     .pipe(gulp.dest('./src/build/minCSS'))
//     .pipe(browserSync.stream());
// }



//Таск на скрипты
function scripts() {
     //Шаблон для поиска файлов JS 
    // Всей файлы по шаблону '.src/js/**/*/.js'
    return gulp.src(jsFiles)
    //Объединение файлов в один
    .pipe(concat('script.js'))
    //Минификация JS
    .pipe(uglify({
        toplevel: true
    }))
    //Выходная папка для скриптов
    .pipe(gulp.dest('./src/build/minJS'))
    .pipe(browserSync.stream());

}



//Удалить всё в указанной папке
function clean() {
    return del(['./src/build/*']);
}


//Просматривать файлы
function watch() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
    //Следить за CSS файлами
    // gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/build/**/*/.css');
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', scripts);
    //Следить за SASS файлами
    gulp.watch('.src/sass/**/*.scss', sassCompiler);
    //При изменении HTML запустить синхронизацию
    gulp.watch('./src/*.html').on('change', browserSync.reload);
}

//Таск вызывающий функцию styles
// gulp.task('styles', styles);
//Таск вызывающий функцию sass
gulp.task('sass', sassCompiler);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Таск для очистки папки build
gulp.task('del', clean);
// Таск для отслеживания изменений
gulp.task('watch', watch);
// Таск для удаление файлов в папке build и запуск styles и scripts
gulp.task('build', gulp.series(clean, gulp.parallel(sassCompiler, scripts)));
// Таск запускает таск build and watch последовательно 
gulp.task('dev', gulp.series('build', 'watch'));