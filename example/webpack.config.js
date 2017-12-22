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
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
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
                    // relative to the project root directory
                    configFile: './tslint.json',
                    tsConfigFile: './example/tsconfig.json',
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
