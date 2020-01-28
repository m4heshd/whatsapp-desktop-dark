const fs = require('fs-extra');
const path = require('path');
const request = require('https').request;
const {URL} = require('url');
const semver = require('semver');
const open = require('open');

let version = '0';
let started = false;
let updURL = 'https://raw.githubusercontent.com/m4heshd/whatsapp-desktop-dark/master/package.json';
let arg = process.argv[2];
arg ? arg.trim() : arg = null;

console.log('\x1b[40m\x1b[4m\x1b[1m\x1b[36m%s\x1b[0m', '\n~~~~ WhatsApp Desktop Dark Mode by m4heshd ~~~~\n\n');

if (arg && arg === 'cli') {
    startCLI();
} else {
    switch (process.platform) {
        case 'win32':
            require("./run-gui").startGUI();
            break;
        case 'darwin':
            require("./run-gui").startGUI();
            break;
        default:
            console.log('\x1b[31m%s\x1b[0m', 'This platform is not supported.\n');
    }
}

function startCLI() {
    fs.readJson(path.join(__dirname, 'info.json'), (error, infoJSON) => {
        if (!error) {
            version = infoJSON.version;
            checkAppUpd();
        } else {
            console.log(error);
            if (!started) {
                start();
                started = true;
            }
        }
    });
}

function checkAppUpd() {
    console.log('Checking for dark mode updates.. (Current version - v' + version + ')\n');

    let req = request(new URL(updURL), function (res) {

        res.on('data', (d) => {
            let latest = JSON.parse(d.toString())["version"];
            if (semver.lt(version, latest)) {
                ask('A new update is available (v' + latest +'). Would you like to download? (Y or N) : ', openDownload, start);
            } else {
                if (!started) {
                    start();
                    started = true;
                }
            }
        });
    });

    req.on('error', (e) => {
        console.log('\x1b[31m%s\x1b[0m', 'Unable to check for updates.\n');
        if (!started) {
            start();
            started = true;
        }
    });

    req.end();
}

function start() {
    switch (process.platform) {
        case 'win32':
            require("./run-win32").start();
            break;
        case 'darwin':
            require("./run-darwin").start();
            break;
        default:
            console.log('\x1b[31m%s\x1b[0m', 'This platform is not supported.\n');
    }
}

function ask(question, yes, no) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question(question, function (resp) {
        resp = resp.trim().toLowerCase();
        switch (resp) {
            case 'y':
            case 'yes':
                console.log('');
                yes();
                break;
            case 'n':
            case 'no':
                console.log('');
                no();
                break;
            default:
                console.log('\x1b[31m%s\x1b[0m', '\nInvalid response. Ending application.\n');
                endApp();
        }
    });
}

function openDownload() {
    (async () => {
        await open('https://github.com/m4heshd/whatsapp-desktop-dark/releases/latest');
    })();
    endApp();
}

function endApp() {
    process.stdout.write('Press any key to exit.. ');

    try {
        process.stdin.setRawMode(true);
    } catch (error) {

    }
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}