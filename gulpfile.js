const { src, dest, watch, parallel, series } = require("gulp");

const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const imagemin = require("gulp-imagemin");

// BROWSER-SYNC
const server = () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
  watch("src/*.html").on("change", browserSync.reload);
};

// MINIFY HTML
const html = () => {
  return src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
};

// COPY FONTS
const fonts = () => {
  return src("src/fonts/**/*")
    .pipe(dest("dist/fonts"))
    .pipe(browserSync.stream());
};

// COPY FAVICON
const favicon = () => {
  return src("src/favicon/*").pipe(dest("dist/favicon"));
};

// COPY MAILER
const mailer = () => {
  return src("src/mailer/**/*").pipe(dest("dist/mailer"));
};

// IMAGE COMPRESSION
const images = () => {
  return (
    src("src/images/**/*.+(jpg|png|jpeg|svg|webp)")
      // .pipe(imagemin())
      .pipe(dest("dist/images"))
      .pipe(browserSync.stream())
  );
};

// CREATE CSS
const styles = () => {
  return src("src/scss/**/*.+(scss|sass|css)")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(
      cleanCSS({ compatibility: "*", level: { 1: { specialComments: 0 } } })
    )
    .pipe(
      rename({
        prefix: "",
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
};

// JAVASCRIPT
const scripts = () => {
  return src([
    "node_modules/just-validate/dist/js/just-validate.js",
    // "node_modules/inputmask/dist/inputmask.js",
    // "node_modules/swiper/swiper-bundle.js",
    // "node_modules/wow.js/dist/wow.js",
    "src/js/*.js",
  ])
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
};

const cleandist = () => {
  return del("dist/**/*", { force: true }); // ?????????????? ?????? ???????????????????? ?????????? "dist/"
};

// WATCHING
const watching = () => {
  watch("src/scss/**/*.+(scss|sass|css)", parallel(styles));
  watch("src/js/main.js", parallel(scripts));
  watch("src/*.html").on("change", parallel(html));
  watch("src/fonts/**/*").on("all", parallel(fonts));
  watch("src/images/**/*").on("all", parallel(images));
};

exports.server = server;
exports.styles = styles;
exports.watching = watching;
exports.scripts = scripts;
exports.html = html;
exports.fonts = fonts;
exports.mailer = mailer;
exports.images = images;
exports.favicon = favicon;
exports.cleandist = cleandist;

exports.default = series(
  cleandist,
  favicon,
  fonts,
  images,
  parallel(scripts, styles, html, server, mailer, watching)
);
