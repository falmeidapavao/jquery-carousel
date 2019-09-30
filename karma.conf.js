// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) { // jshint ignore:line
  config.set({ // jshint ignore:line
    basePath: '',
    frameworks: ['jasmine'],
    preprocessors: {
      'src/**/*.js': ['babel'],
      'spec/**/*.spec.js': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: ['@babel/preset-env'],
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/fast-check/lib/bundle.js',
      'src/**/*.js',
      'spec/**/*.spec.js'
    ],
    plugins: [
      require('karma-jasmine'), // jshint ignore:line
      require('karma-chrome-launcher'), // jshint ignore:line
      require('karma-jasmine-html-reporter'), // jshint ignore:line
      require('karma-coverage-istanbul-reporter'), // jshint ignore:line
      require('karma-babel-preprocessor'), // jshint ignore:line
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeCI'],
    customLaunchers: {
      ChromeCI: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      }
    },
    singleRun: false
  });
};
