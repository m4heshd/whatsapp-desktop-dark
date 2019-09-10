const fs = require('fs-extra');
const asar = require('asar');
const path = require('path');
const {spawn} = require("child_process");
const ps = require('ps-node');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
let WAPath = null;
let execPath = '/Applications/WhatsApp.app/Contents/MacOS/WhatsApp';
let restore = false;
let customize = false;
let bkPath = path.join(__dirname, 'backup', 'app.asar');

exports.start = function () {
    console.log('\x1b[33m%s\x1b[0m', 'This process takes at least a minute to complete. So please be patient and let it do the magic..\n');

    if (fs.existsSync(bkPath)) {
        ask('A backup file was found. Do you want to restore WhatsApp? (Y or N) : ', function () {
            restore = true;
            checkProcess();
        }, function () {
            ask('Current backup will be replaced and it cannot be undone. Are you sure want to continue? (Y or N) : ', function () {
                checkProcess();
            }, function () {
                console.log('\x1b[32m%s\x1b[0m', '\nHope you\'re enjoying WhatsApp dark.. :)\n');
                endApp();
            });
        });
    } else {
        checkProcess();
    }
};

function checkProcess() {
    ps.lookup({
        command: execPath,
        psargs: 'ax'
    }, function (err, resultList) {
        if (err) {
            console.log(err);
        } else {
            if (resultList.length) {
                console.log('Wait for the application to kill WhatsApp and start the process..');
                WAPath = '/Applications/WhatsApp.app/Contents/Resources/app.asar';
                // console.log(WAPath);
                killWhatsApp(resultList);
                // checkProcess(true)
            } else {
                if (WAPath) {
                    if (restore) {
                        restoreBackup(WAPath);
                    } else {
                        ask('\nWould you like to customize the accent color? Default is blue (Y or N) : ', customAccent, function () {
                            applyDarkStyles(WAPath);
                        });
                    }
                } else {
                    console.log('\x1b[31m%s\x1b[0m', 'WhatsApp process not found. Make sure WhatsApp desktop is running before installing dark mode.\n');
                    endApp();
                }
            }

        }
    });
}

function killWhatsApp(procList) {
    let pid = procList[0].pid;
    ps.kill( pid, {signal:'SIGTERM', timeout:30}, function( err ) {
        if (err) {
            // throw new Error( err );
            console.log('\x1b[31m%s\x1b[0m', 'Unable to kill WhatsApp. Please close WhatsApp manually.');
            checkProcess();
        } else {
            checkProcess();
        }
    });
}

function applyDarkStyles(procPath) {
    try {
        // console.log(procPath);
        // let dir = path.dirname(procPath);
        let fullpath = procPath;

        console.log('Backing up..');
        fs.copySync(fullpath, bkPath);

        console.log('Extracting..');
        let extPath = path.join(__dirname, 'extracted');
        asar.extractAll(fullpath, extPath);

        console.log('Injecting styles..');
        let stylePath = path.join(__dirname, 'styles', 'darwin');
        if (fs.existsSync(path.join(extPath, 'index.html'))) {
            try {
                fs.copySync(stylePath, extPath);
                let newAsar = path.join(__dirname, 'app.asar');
                asar.createPackage(extPath, newAsar, function () {
                    console.log('Replacing files..');
                    try {
                        fs.copySync(newAsar, fullpath);

                        console.log('Cleaning up..');
                        fs.removeSync(extPath);
                        fs.removeSync(newAsar);

                        if (customize) {
                            let bkPath = path.join(__dirname, 'styles', 'darwin', 'bk');

                            fs.copySync(path.join(bkPath, 'dark.css'), path.join(stylePath, 'dark.css'));
                            fs.copySync(path.join(bkPath, 'index.html'), path.join(stylePath, 'index.html'));
                            fs.removeSync(bkPath);
                        }

                        console.log('\x1b[32m%s\x1b[0m', '\nAll done. May your beautiful eyes burn no more.. Enjoy WhatsApp Dark mode!! :)\n');
                        let WAPP = spawn(execPath, [], {
                            detached: true,
                            stdio: ['ignore', 'ignore', 'ignore']
                        });
                        WAPP.unref();
                        endApp();
                    } catch (error) {
                        console.log(error);
                        console.log('\x1b[31m%s\x1b[0m', 'An error occurred. Cleaning up..');
                        fs.removeSync(extPath);
                        fs.removeSync(newAsar);
                    }
                });
            } catch (error) {
                console.log(error);
                endApp();
            }
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Failed to extract WhatsApp source.');
            endApp();
        }
    } catch (error) {
        console.log(error);
        endApp();
    }
}

function restoreBackup(procPath) {
    console.log('Restoring original version of the application...');
    // let dir = path.dirname(procPath);
    let fullpath = procPath;
    try {
        fs.copySync(bkPath, fullpath);

        console.log('\x1b[32m%s\x1b[0m', '\nAll done. Make sure to let the developers know if something was wrong.. :)\n');
        let WAPP = spawn(execPath, [], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });
        WAPP.unref();
        endApp();
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'An error occurred while restoring.\n');
        console.log(error);
        endApp();
    }
}

function customAccent() {
    let stylePath = path.join(__dirname, 'styles', 'darwin', 'dark.css');
    let htmlPath = path.join(__dirname, 'styles', 'darwin', 'index.html');
    let bkPath = path.join(__dirname, 'styles', 'darwin', 'bk');

    fs.copySync(stylePath, path.join(bkPath, 'dark.css'));
    fs.copySync(htmlPath, path.join(bkPath, 'index.html'));

    customize = true;

    readline.question('Insert a valid CSS color value : ', function (resp) {
        resp = resp.trim();
        if (require('is-color')(resp)) {
            fs.readFile(stylePath, 'utf8', (err, data) => {
                if (!err) {
                    let newStyle = data.replace(/^.*--accent:.*$/mg, "    --accent: " + resp + ";");
                    fs.outputFile(stylePath, newStyle, err => {
                        if (err) {
                            console.log('\x1b[31m%s\x1b[0m', 'Unable to process the request.\n');
                            console.error(err);
                            applyDarkStyles(WAPath);
                        } else {
                            fs.readFile(htmlPath, 'utf8', (err, data) => {
                                if (!err) {
                                    let newHtml = data.replace("progress[value]::-webkit-progress-value{background-color:#5792ff}progress[value]::-moz-progress-bar{background-color:#5792ff}", "progress[value]::-webkit-progress-value{background-color:" + resp + "}progress[value]::-moz-progress-bar{background-color:" + resp + "}");
                                    fs.outputFile(htmlPath, newHtml, err => {
                                        if (err) {
                                            console.log('\x1b[31m%s\x1b[0m', 'Unable to process the request.\n');
                                            console.error(err);
                                            applyDarkStyles(WAPath);
                                        } else {
                                            console.log('\x1b[32m%s\x1b[0m', '\nAccent color was successfully set to ' + resp + '\n');
                                            applyDarkStyles(WAPath);
                                        }
                                    });
                                } else {
                                    console.log('\x1b[31m%s\x1b[0m', 'Unable to process the request.\n');
                                    console.error(err);
                                    applyDarkStyles(WAPath);
                                }
                            });
                        }
                    });
                } else {
                    console.log('\x1b[31m%s\x1b[0m', 'Unable to process the request.\n');
                    console.error(err);
                    applyDarkStyles(WAPath);
                }
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Invalid color. Try again.\n');
            customAccent();
        }
    });
}

function ask(question, yes, no) {
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

function endApp() {
    process.stdout.write('Press any key to exit.. ');

    try {
        process.stdin.setRawMode(true);
    } catch (error) {

    }
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}