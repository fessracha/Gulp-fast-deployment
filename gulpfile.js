var gulp        = require('gulp'),
    sass        = require('gulp-sass'), //Компилирует sass|scss в css
    browserSync = require('browser-sync'),// Live-reload
    concat      = require('gulp-concat'), // Конкатенация файлов
    uglify      = require('gulp-uglifyjs')//Минификация js файлов
    cssnano     = require('gulp-cssnano'), //Минификация css файлов
    rename      = require('gulp-rename'), //Для добавления .min к файлам
    autoprefixer = require('gulp-autoprefixer');// Автоматическое добавление префиксов

gulp.task('sass', function(){ // Создаем таск "sass"
    return gulp.src('assets/scss/**/*.scss') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('assets/css/')) // Выгружаем результата в папку assets/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: '.' // Директория для сервера
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'assets/libs/jquery/dist/jquery.min.js', // Берем jQuery
        'assets/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('assets/js')); // Выгружаем в папку assets/js
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('assets/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('assets/css')); // Выгружаем в папку assets/css
});

gulp.task('watch', ['browser-sync','css-libs', 'sass'], function() {
    gulp.watch('assets/scss/**/*.scss', ['sass']); // Наблюдение за scss файлами
    gulp.watch('*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('assets/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});