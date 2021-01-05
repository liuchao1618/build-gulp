const { src, dest, parallel, series, watch } = require("gulp");

const del = require("del");
const browserSync = require("browser-sync");

// 自动加载插件 解决加载npm模块过多，回顾代码困难
const loadPlugins = require("gulp-load-plugins");

const plugins = loadPlugins();

// 热更新开发服务器
const bs = browserSync.create();

// const data = {
//   menus: [
//     {
//       name: "Home",
//       icon: "aperture",
//       link: "index.html"
//     },
//     {
//       name: "Features",
//       link: "features.html"
//     },
//     {
//       name: "About",
//       link: "about.html"
//     },
//     {
//       name: "Contact",
//       link: "#",
//       children: [
//         {
//           name: "Twitter",
//           link: "https://twitter.com/w_liuchao"
//         },
//         {
//           name: "About",
//           link: "https://weibo.com/liuchao"
//         },
//         {
//           name: "Divider"
//         },
//         {
//           name: "About",
//           link: "https://github.com/liuchao"
//         }
//       ]
//     }
//   ],
//   pkg: require("./package.json"),
//   date: new Date()
// };

const cwd = process.cwd();
let config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**'
    }
  }
}

try {
  const loadConfig = require(`${cwd}/pages.config.js`);
  config = Object.assign({}, config, loadConfig);
}catch(e){}

// 样式编译（gulp-sass）
const style = () => {
  // return src("src/assets/styles/*.scss", { base: "src" })
  return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    // .pipe(dest("temp"))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }));
};

// 脚本编译
const script = () => {
  // return src("src/assets/scripts/*.js", { base: "src" })
  return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.babel({ presets: [require("@babel/preset-env")] }))
    // .pipe(dest("temp"))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }));
};

// 模版文件编译   defaults 配置：防止模板缓存导致页面不能及时更新
const page = () => {
  // return src("src/*.html", { base: "src" })
  return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.swig({ data: config.data, defaults: { cache: false } }))
    // .pipe(dest("temp"))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }));
};

// 图片的转换
const image = () => {
  // return src("src/assets/images/**", { base: "src" })
  return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    // .pipe(dest("dist"));
    .pipe(dest(config.build.dist));
};

// 字体文件的转换
const font = () => {
  // return src("src/assets/fonts/**", { base: "src" })
  return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    // .pipe(dest("dist"));
    .pipe(dest(config.build.paths.fonts));
};

// 其他文件的转换
const extra = () => {
  // return src("public/**", { base: "public" }).pipe(dest("dist"));
  return src("**", { base: config.build.public, cwd: config.build.public }).pipe(dest(config.build.public));
};

// 清除文件
const clean = () => {
  // return del(["dist", "temp"]);
  return del([config.build.dist, config.build.temp]);
};

const cleanTemp = () => {
  // return del(["temp"]);
  return del([config.build.temp]);
};

// 开发服务器服务
const serve = () => {
  // watch("src/assets/styles/*.scss", style);
  watch(config.build.paths.styles, {cwd: config.build.src}, style);
  // watch("src/assets/scripts/*.js", script);
  watch(config.build.paths.scripts, {cwd: config.build.src}, script);
  // watch("src/*.html", page);
  watch(config.build.paths.pages, {cwd: config.build.src}, page);
  // eslint-disable-next-line capitalized-comments
  // watch("src/assets/images/**", image);
  // watch("src/assets/fonts/**", font);
  // watch("public/**", extra);


  // watch(
  //   ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
  //   bs.reload
  // );
  watch(
    [config.build.paths.images, config.build.paths.fonts],
    {cwd: config.build.src},
    bs.reload
  );
  watch(
    "**",
    {cwd: config.build.src},
    bs.reload
  );

  bs.init({
    notify: false, // 不加右上角加载提示框
    port: 3000,
    open: true,
    // Files: "dist/**", // 修改编译后的文件自动更新   这个字段和对应的html、js、sass处理最后加上pipe(bs.reload({stream: true}))互斥
    server: {
      // eslint-disable-next-line capitalized-comments
      // baseDir: "dist",
      // baseDir: ["dist", "src", "public"],
      // baseDir: ["temp", "src", "public"],
      baseDir: [config.build.temp, config.build.src, config.build.public],
      routes: {
        "/node_modules": "node_modules"
      }
    }
  });
};

// 文件引用处理   并分别压缩HTML、CSS、JavaScript
const useref = () => {
  return (
    // src("temp/*.html", { base: "temp" })
    src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.temp })
      // .pipe(plugins.useref({ searchPath: ["temp", "."] }))
      .pipe(plugins.useref({ searchPath: [config.build.temp, "."] }))
      // 压缩HTML、CSS、JavaScript
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
          })
        )
      )
      // .pipe(dest("dist"))
      .pipe(dest(config.build.dist))
  );
};

// 组合任务
const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra),
  cleanTemp
);

const develop = series(compile, serve);

module.exports = {
  // eslint-disable-next-line capitalized-comments
  // style,
  // script,
  // page,
  // image,
  // font,
  // serve,
  // compile,
  clean,
  build,
  develop
};