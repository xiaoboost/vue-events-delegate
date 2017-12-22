const path = require('path');

function resolve(dir = '') {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    output: {
        path: __dirname,
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
                    configFile: './tslint.json',
                    tsConfigFile: './test/tsconfig.json',
                    include: [resolve('test'), resolve('src')],
                    formattersDirectory: 'node_modules/tslint-loader/formatters/',
                },
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: false,
                },
            },
        ],
    },
};
