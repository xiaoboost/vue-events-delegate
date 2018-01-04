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
        extensions: ['.ts', '.js'],
        mainFiles: ['index.ts'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
    plugins: [],
    devtool: '#inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'tslint-loader',
                enforce: 'pre',
                options: {
                    typeCheck: true,
                    emitErrors: true,
                    configFile: resolve('tslint.json'),
                    tsConfigFile: resolve('test/tsconfig.json'),
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
                    // FIXME: Error: files is empty
                    // configFile: resolve('test/tsconfig.json'),
                },
            },
        ],
    },
};
