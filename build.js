const path = require("path");
const fs = require('fs-extra');
const {exec} = require("child_process");
const {compile} = require('nexe');

let distDir = path.join(__dirname, 'dist', 'Windows');
let out = path.join(distDir, 'WADark.exe');
let stylePath = path.join(__dirname, 'styles', 'win32');
let distStylePath = path.join(distDir, 'styles', 'win32');
let target = 'windows-x86-12.9.1';

let platform = process.argv[2].trim();

switch (platform) {
    case 'win32':
        runBuild();
        break;
    case 'darwin':
        distDir = path.join(__dirname, 'dist', 'macOS');
        out = path.join(distDir, 'WADark');
        stylePath = path.join(__dirname, 'styles', 'darwin');
        distStylePath = path.join(distDir, 'styles', 'darwin');
        target = 'mac-x64-12.9.1';
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
        targets: target,
        resources: ['gui/**/*']
    }).then(() => {
        try {
            console.log('Copying resources..');
            fs.copySync(stylePath, distStylePath);
            fs.copySync(path.join(__dirname, 'info.json'), path.join(distDir, 'info.json'));
            let themes = fs.readdirSync(path.join(__dirname, 'themes')).filter(x => x !== 'README.md');
            let themeObjects = [];
            themes.forEach(themeDir => {
                themeObjects.push(JSON.parse(fs.readFileSync(path.join(__dirname, 'themes', themeDir, 'override.json'), 'utf8')))
            });
            fs.writeFileSync(path.join(distDir, 'override.json'), JSON.stringify(themeObjects, null, "\t"));
            switch (platform) {
                case 'win32':
                    setWinIcon();
                    break;
                case 'darwin':
                    console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run \'WADark\' from dist\\macOS directory.\n');
                    exec(`open "${distDir}"`);
                    break;
                default:
                    console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run the executable from dist directory.\n');
            }
        } catch (error) {
            console.error(error);
        }
    }).catch(err => {
        console.error(err);
    });
}

function setWinIcon() {
    if (process.platform === 'win32') {
        let command = ' -open "' + out +'" ' +
            '-save "' + out +'" ' +
            '-action addoverwrite ' +
            '-res "' + path.join(__dirname, 'icons', 'wa_dark.ico') + '" ' +
            '-mask ICONGROUP,1,1033 ' +
            '-log NUL';

        exec(path.join('node_modules', 'resourcehacker', 'bin', 'ResourceHacker.exe') + command, function (error) {
            if (error) {
                console.log(error);
                console.log('\x1b[31m%s\x1b[0m', 'Failed to set the windows executable icon.\n');
                console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run \'WADark.exe\' from dist\\Windows directory.\n');
                exec(`start "" "${distDir}"`);
            } else {
                console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run \'WADark.exe\' from dist\\Windows directory.\n');
                exec(`start "" "${distDir}"`);
            }
        });
    } else {
        console.log('\x1b[32m%s\x1b[0m', '\nAll done. Run \'WADark.exe\' from dist\\Windows directory.\n');
    }
}