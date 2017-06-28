'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuild)
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild);
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      console.log((err.message || err) + '\n');
      process.exit(1);
    }
  );

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (process.env.CI && messages.warnings.length) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      // 输出日志目录
      var outputFile = path.resolve(__dirname, '../stats.json');
      var statsOption = {
        // 增加资源信息
        assets          : true,
        // 对资源按指定的项进行排序
        assetsSort      : 'field',
        // 增加缓存了的（但没构建）模块的信息
        cached          : true,
        // Show cached assets (setting this to `false` only shows emitted files)
        cachedAssets    : true,
        // 增加子级的信息
        children        : true,
        // 增加包信息（设置为 `false` 能允许较少的冗长输出）
        chunks          : true,
        // 将内置模块信息增加到包信息
        chunkModules    : true,
        // 增加包 和 包合并 的来源信息
        chunkOrigins    : true,
        // 对包按指定的项进行排序
        chunksSort      : 'field',
        // 用于缩短请求的上下文目录
        context         : '../src/',
        // `webpack --colors` 等同于
        colors          : true,
        // Display the distance from the entry point for each module
        depth           : false,
        // Display the entry points with the corresponding bundles
        entrypoints     : false,
        // 增加错误信息
        errors          : true,
        // 增加错误的详细信息（就像解析日志一样）
        errorDetails    : true,
        // Exclude modules which match one of the given strings or regular expressions
        exclude         : [],
        // 增加编译的哈希值
        hash            : true,
        // Set the maximum number of modules to be shown
        maxModules      : 150,
        // 增加内置的模块信息
        modules         : true,
        // 对模块按指定的项进行排序
        modulesSort     : 'field',
        // Show performance hint when file size exceeds `performance.maxAssetSize`
        performance     : true,
        // Show the exports of the modules
        providedExports : false,
        // 增加 public path 的信息
        publicPath      : true,
        // 增加模块被引入的原因
        reasons         : true,
        // 增加模块的源码
        source          : true,
        // 增加时间信息
        timings         : true,
        // Show which exports of a module are used
        usedExports     : false,
        // 增加 webpack 版本信息
        version         : true,
        // 增加提示
        warnings        : true,
      };
      // 打包日志
      var statsJson = stats.toJson(statsOption);
      // fs.writeFile(outputFile, JSON.stringify(statsJson, null, 4), function(err) {
      //   if(err) {
      //     console.log(err);
      //   } else {
      //     console.log(
      //       chalk.green("JSON saved to " + outputFile)
      //     );
      //   }
      // });

      // 控制台输出打包日志
      // console.log(stats.toString(statsOption));


      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
