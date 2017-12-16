const fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    shell = require('shelljs'),
    uglify = require('uglify-js'),
    rollup = require('rollup'),
    spawn = require('child_process').spawn,
    replace = require('rollup-plugin-replace'),
    project = require('../package.json'),
    output = resolve('dist'),
    json = require('json5');

const banner =
`/**
  * ${project.name} v${project.version}
  * (c) 2017-${new Date().getFullYear()} Xiaoboost
  * @license MIT
  */`;

const configs = [
    {
        file: resolve(`dist/${project.name}.js`),
        format: 'umd',
        env: 'development',
    },
    {
        file: resolve(`dist/${project.name}.min.js`),
        format: 'umd',
        env: 'production',
    },
    {
        file: resolve(`dist/${project.name}.common.js`),
        format: 'cjs',
    },
];

function resolve(_path) {
    return path.resolve(__dirname, '../', _path);
}

function getSize(code) {
    return (code.length / 1024).toFixed(2) + 'kb';
}

function promiseSpawn(command, ...args) {
    return new Promise((resolve, reject) => {
        const task = spawn(command, args);
        task.on('close', resolve);
        task.on('error', reject);
    });
}

function createEnv(config) {
    const environment = {
        input: {
            'input': resolve('lib/src/index.js'),
            'external': ['vue'],
            'plugins': [],
        },
        output: {
            banner,
            'exports': 'named',
            'file': config.file,
            'format': config.format,
            'name': 'VueEventsDelegate',
            'globals': {
                vue: 'Vue',
            },
        },
    };

    if (config.env) {
        environment.input.plugins.unshift(replace({
            'process.env.NODE_ENV': JSON.stringify(config.env),
        }));
    }

    return environment;
}

function write(dest, code) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dest, code, (err) => {
            if (err) {
                return reject(err);
            }

            console.log(chalk.blue(path.relative(process.cwd(), dest)) + '  ' + getSize(code));
            resolve();
        });
    });
}

function read(dest) {
    return new Promise((resolve, reject) => {
        fs.readFile(dest, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data.toString());
        });
    });
}

console.log('\x1Bc');
console.log(chalk.yellow('> Start Compile:\n'));
shell.rm('-rf', path.join(output, '*'));

async function main() {
    await promiseSpawn('node', 'node_modules/typescript/lib/tsc.js', '-p', '.');

    for (const config of configs) {
        const { input, output } = createEnv(config);
        const bundle = await rollup.rollup(input);

        let { code } = await bundle.generate(output);

        if (/min\.js$/.test(output.file)) {
            code = uglify.minify(code, {
                output: {
                    preamble: output.banner,
                    ascii_only: true,
                },
            }).code;
        }

        await write(output.file, code);
    }

    const tsconfig = await read(resolve('tsconfig.json'));
    shell.rm('-rf', resolve(json.parse(tsconfig).compilerOptions.outDir));
}

main();
