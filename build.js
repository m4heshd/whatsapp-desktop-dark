const path = require("path");
const fs = require('fs-extra');
const {exec} = require("child_process");
const {compile} = require('nexe');

let distDir = path.join(__dirname, 'dist', 'Windows');
let out = path.join(distDir, 'WADark.exe');
let stylePath = path.join(__dirname, 'styles', 'win32');
let distStylePath = path.join(distDir, 'styles', 'win32');
let target = 'windows-x86-12.7.0';

switch (process.argv[2].trim()) {
    case 'win32':
        runBuild();
        break;
    case 'darwin':
        distDir = path.join(__dirname, 'dist', 'macOS');
        out = path.join(distDir, 'WADark');
        stylePath = path.join(__dirname, 'styles', 'darwin');
        distStylePath = path.join(distDir, 'styles', 'darwin');
        target = 'mac-x64-12.7.0';
        runBuild();
        break;
    default:
        console.log('\x1b[31m%s\x1b[0m', 'Invalid platform type.\n');
}

function runBuild() {
    compile({
        input: path.join(__dirname, 'index.js'),
        build: false,
        output: out,
        targets: target
    }).then(() => {
        try {
            console.log('Copying resources..');
            fs.copySync(stylePath, distStylePath);
            switch (process.platform) {
                case 'win32':
                    console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run \'WADark.exe\' from dist\\Windows directory.\n');
                    exec(`start "" "${distDir}"`);
                    break;
                case 'darwin':
                    console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run \'WADark\' from dist\\macOS directory.\n');
                    exec(`open "${distDir}"`);
                    break;
                default:
                    console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run the executable from dist directory.\n');
            }
        } catch (error) {
            console.error(error)
        }
    }).catch(err => {
        console.error(err)
    });
}