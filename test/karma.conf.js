/**
 * For more karma config:
 *  http://karma-runner.github.io/0.13/config/configuration-file.html
 *
 * For more karma-webpack config:
 *   https://github.com/webpack/karma-webpack
 */

module.exports = (config) => config.set({
    browsers: ['headlessChrome'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    client: {
        captureConsole: false,
    },
    preprocessors: {
        './index.js': ['webpack', 'sourcemap'],
    },
    webpack: require('./webpack.config'),
    webpackMiddleware: { noInfo: true },
    // FIXME: coverage does not work
    coverageReporter: {
        dir: './coverage',
        reporters: [
            { type: 'lcov', subdir: '.' },
            { type: 'text-summary' },
        ],
    },
    customLaunchers: {
        'headlessChrome': {
            base: 'Chrome',
            flags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222', '--no-sandbox'],
        },
    },
});
