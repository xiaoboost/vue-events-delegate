/**
 * For more karma config:
 *  http://karma-runner.github.io/0.13/config/configuration-file.html
 *
 * For more karma-webpack config:
 *   https://github.com/webpack/karma-webpack
 */

module.exports = function(config) {
    config.set({
        // 测试浏览器
        browsers: ['headlessChrome'],
        // 测试框架
        frameworks: ['mocha', 'sinon-chai'],
        // 测试报告处理
        reporters: ['spec', 'coverage'],
        // 测试的文件
        files: ['./main.js'],
        // 预处理文件
        preprocessors: {
            './main.js': ['webpack', 'sourcemap'],
        },
        webpack: require('./webpack.config'),
        webpackMiddleware: {
            noInfo: true,
        },
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
};
