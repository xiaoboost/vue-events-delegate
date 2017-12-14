const path = require('path');

function resolve(dir = '') {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: resolve('example/main.ts'),
    output: {
        path: resolve('example'),
        filename: 'build.js',
    },
    resolve: {
        extensions: ['.js', '.ts'],
        mainFiles: ['index.ts'],
    },
    plugins: [],
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'tslint-loader',
                enforce: 'pre',
                options: {
                    typeCheck: true,
                    emitErrors: true,
                    configFile: 'tslint.json',
                    tsConfigFile: 'tsconfig.json',
                    include: [resolve('example'), resolve('src')],
                    formattersDirectory: 'node_modules/tslint-loader/formatters/',
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: false,
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    esModule: true,
                },
            },
        ],
    },
};
