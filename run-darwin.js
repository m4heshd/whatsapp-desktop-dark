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
                        if (fs.existsSync(path.join(__dirname, 'override.json'))) {
                            overrideStyles();
                        } else {
                            ask('\nWould you like to customize the accent color? Default is blue (Y or N) : ', customAccent, function () {
                                applyDarkStyles(WAPath);
                            });
                        }
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

    console.log('\x1b[33m%s\x1b[0m', 'TIP: You can create/download custom themes using "override.json" (Instructions are in the documentation)\n');

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

function overrideStyles() {
    let stylePath = path.join(__dirname, 'styles', 'darwin', 'dark.css');
    let htmlPath = path.join(__dirname, 'styles', 'darwin', 'index.html');
    let bkPath = path.join(__dirname, 'styles', 'darwin', 'bk');

    fs.copySync(stylePath, path.join(bkPath, 'dark.css'));
    fs.copySync(htmlPath, path.join(bkPath, 'index.html'));

    customize = true;

    fs.readJson(path.join(__dirname, 'override.json'), (error, ovrdJSONObject) => {
        if (!error) {
            const themeNames = ovrdJSONObject.map((ovrd, i) => (i+1) + '. ' + ovrd.themeName );
            let ovrdJSON = ovrdJSONObject.find(x => x.themeName === 'Default');
            readline.question('Pick one of the following themes:\n'+themeNames.join('\n')+'\n', (resp) => {
                if(!isNaN(resp) && parseInt(resp) <= ovrdJSONObject.length) {
                    ovrdJSON = ovrdJSONObject[resp-1];
                } else {
                    console.log('\nInvalid option. Applying default theme.');
                }
                let themeName = ((ovrdJSON.themeName === undefined) ? 'Unknown' : ovrdJSON.themeName);
                let dark = ((ovrdJSON.dark === undefined) ? '#272c35' : ovrdJSON.dark);
                let dark_alpha = ((ovrdJSON.dark_alpha === undefined) ? 'rgba(39, 44, 53, 0.89)' : ovrdJSON.dark_alpha);
                let darker = ((ovrdJSON.darker === undefined) ? '#1f232a' : ovrdJSON.darker);
                let bgcol = ((ovrdJSON.bgcol === undefined) ? '#101318' : ovrdJSON.bgcol);
                let light = ((ovrdJSON.light === undefined) ? '#d1d1d1' : ovrdJSON.light);
                let lighter = ((ovrdJSON.lighter === undefined) ? '#e9e9e9' : ovrdJSON.lighter);
                let accent = ((ovrdJSON.accent === undefined) ? '#5792ff' : ovrdJSON.accent);
                let accent2 = ((ovrdJSON.accent2 === undefined) ? '#09d261' : ovrdJSON.accent2);
                let icon = ((ovrdJSON.icon === undefined) ? '#e1e1e1' : ovrdJSON.icon);
                let shadow = ((ovrdJSON.shadow === undefined) ? 'rgba(0, 0, 0, 0.12)' : ovrdJSON.shadow);
                let mred = ((ovrdJSON.mred === undefined) ? '#dd3b4f' : ovrdJSON.mred);
                let mgreen = ((ovrdJSON.mgreen === undefined) ? '#70A352' : ovrdJSON.mgreen);
                let mblue = ((ovrdJSON.mblue === undefined) ? '#527AA3' : ovrdJSON.mblue);
                let msgout = ((ovrdJSON.msgout === undefined) ? '#131a25' : ovrdJSON.msgout);

                fs.readFile(stylePath, 'utf8', (err, data) => {
                    if (!err) {
                        let newStyle = data;
                        newStyle = newStyle.replace(/^.*--dark:.*$/mg, "    --dark: " + dark + ";");
                        newStyle = newStyle.replace(/^.*--dark_alpha:.*$/mg, "    --dark_alpha: " + dark_alpha + ";");
                        newStyle = newStyle.replace(/^.*--darker:.*$/mg, "    --darker: " + darker + ";");
                        newStyle = newStyle.replace(/^.*--bgcol:.*$/mg, "    --bgcol: " + bgcol + ";");
                        newStyle = newStyle.replace(/^.*--light:.*$/mg, "    --light: " + light + ";");
                        newStyle = newStyle.replace(/^.*--lighter:.*$/mg, "    --lighter: " + lighter + ";");
                        newStyle = newStyle.replace(/^.*--accent:.*$/mg, "    --accent: " + accent + ";");
                        newStyle = newStyle.replace(/^.*--accent2:.*$/mg, "    --accent2: " + accent2 + ";");
                        newStyle = newStyle.replace(/^.*--icon:.*$/mg, "    --icon: " + icon + ";");
                        newStyle = newStyle.replace(/^.*--shadow:.*$/mg, "    --shadow: " + shadow + ";");
                        newStyle = newStyle.replace(/^.*--mred:.*$/mg, "    --mred: " + mred + ";");
                        newStyle = newStyle.replace(/^.*--mgreen:.*$/mg, "    --mgreen: " + mgreen + ";");
                        newStyle = newStyle.replace(/^.*--mblue:.*$/mg, "    --mblue: " + mblue + ";");
                        newStyle = newStyle.replace(/^.*--msgout:.*$/mg, "    --msgout: " + msgout + ";");

                        fs.outputFile(stylePath, newStyle, err => {
                            if (err) {
                                console.log('\x1b[31m%s\x1b[0m', 'Unable to process the request.\n');
                                console.error(err);
                                applyDarkStyles(WAPath);
                            } else {
                                fs.readFile(htmlPath, 'utf8', (err, data) => {
                                    if (!err) {
                                        let newHtml = data.replace("progress[value]::-webkit-progress-value{background-color:#5792ff}progress[value]::-moz-progress-bar{background-color:#5792ff}", "progress[value]::-webkit-progress-value{background-color:" + accent + "}progress[value]::-moz-progress-bar{background-color:" + accent + "}");
                                        fs.outputFile(htmlPath, newHtml, err => {
                                            if (err) {
                                                console.log('\x1b[31m%s\x1b[0m', 'Unable to process the request.\n');
                                                console.error(err);
                                                applyDarkStyles(WAPath);
                                            } else {
                                                console.log('\x1b[32m%s\x1b[0m', '\nTheme "' + themeName + '" was successfully applied.\n');
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
            });
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Unable to read "override.json" file.\n');
            console.log(error);

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