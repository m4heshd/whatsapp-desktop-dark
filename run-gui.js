const fs = require('fs-extra');
const ps = require('ps-node');
const request = require('https').request;
const {URL} = require('url');
const semver = require('semver');
const asar = require('asar');
const path = require('path');
const {spawn} = require("child_process");
const open = require('open');
const express = require('express');
const xApp = express();
let io = require('socket.io');

let client = null;
let version = '0';
let started = false;
let updURL = 'https://raw.githubusercontent.com/m4heshd/whatsapp-desktop-dark/master/package.json';
let bkPath = path.join(__dirname, 'backup', 'app.asar');
let WAPath = null;
let platform = process.platform;
let execPath = '/Applications/WhatsApp.app/Contents/MacOS/WhatsApp';
let command = 'WhatsApp.exe';
let psargs = 'ux';

if (platform === 'darwin') {
    WAPath = '/Applications/WhatsApp.app/Contents/Resources/app.asar';
    command = execPath;
    psargs = 'ax';
}

//Backend setup
exports.startGUI = function () {
    xApp.use(express.static(path.join(__dirname, 'gui')));

    let xServ = xApp.listen(3210, function () {
        console.log('WADark GUI installer backend started');
        openInstaller();
    });

    io = io(xServ, {
        pingTimeout: 90000
    });

    io.on('connection', function (socket) {
        if (!started) {
            client = socket;
            console.log('WADark installer client connected. ID - ' + socket.id);

            //Incoming messages
            client.on('startInstall', function () {
                setOLTxt('Identifying process..');
                if (fs.existsSync(bkPath)) {
                    ask('Current backup will be replaced and it cannot be undone. Are you sure want to continue?', function () {
                        validateAndStart(false);
                    }, function () {
                        say('Hope you\'re enjoying WhatsApp dark.. :)');
                        hideOL();
                    });
                } else {
                    validateAndStart(false);
                }
            });

            client.on('startRestore', function () {
                setOLTxt('Identifying process..');
                if (fs.existsSync(bkPath)) {
                    validateAndStart(true);
                } else {
                    say('Unable to locate the backup file');
                    hideOL();
                }
            });

            client.on('endApp', function () {
                console.log('Quitting the installer..\n');
                client.disconnect();
                process.exit(0);
            });

            client.on('checkUpd', function () {
                checkAppUpd(false);
            });

            if (platform === 'darwin') {
                setMacUI();
            }

            startInit();
        } else {
            console.log('Client connection rejected. ID - ' + socket.id);
            socket.emit('setOLTxt', 'One instance of the process is already running.. Please restart if this is an error.');
        }
    });
};

//Backend functions
function startInit() {
    showOL('Reading version info..');
    fs.readJson(path.join(__dirname, 'info.json'), (error, infoJSON) => {
        if (!error) {
            version = infoJSON.version;
            // version = "0.3.4940";
            setVersion('v' + version);
            checkAppUpd(true);
        } else {
            console.log(error);
            start();
        }
    });
}

function checkAppUpd(isStart) {
    showOL('Checking for updates..');
    let req = request(new URL(updURL), function (res) {

        res.on('data', (d) => {
            let latest = JSON.parse(d.toString())['version'];
            if (semver.lt(version, latest)) {
                ask('A new update is available (v' + latest + '). Would you like to download?', openDownload, start);
            } else {
                if (isStart) {
                    start();
                } else {
                    hideOL();
                    say('Your script copy is up to date.');
                }
            }
        });
    });

    req.on('error', (e) => {
        console.log(e);
        if (isStart) {
            start();
        } else {
            hideOL();
        }
    });

    req.end();
}

function start() {
    getThemes(function () {
        endInit(fs.existsSync(bkPath));
    });
}

function validateAndStart(isRestore) {
    if (platform === 'darwin') {
        if (fs.existsSync(WAPath)) {
            startInstall(isRestore);
        } else {
            say('Unable to locate your WhatsApp Desktop installation. Check again and retry.');
            hideOL();
        }
    } else {
        startInstall(isRestore);
    }
}

function startInstall(isRestore) {
    started = true;
    ps.lookup({
        command: command,
        psargs: psargs
    }, function (err, resultList) {
        if (err) {
            console.log(err);
        } else {
            if (resultList.length) {
                setOLTxt('Please close WhatsApp Desktop manually to continue installation.. </br>(Please wait if you already have)');
                if (platform === 'win32') {
                    WAPath = resultList[0].command;
                    execPath = WAPath;
                }
                startInstall(isRestore);
            } else {
                if (WAPath) {
                    if (isRestore) {
                        restoreBackup(WAPath);
                    } else {
                        if (fs.existsSync(path.join(__dirname, 'override.json'))) {
                            overrideStyles();
                        } else {
                            applyDarkStyles(WAPath);
                        }
                    }
                } else {
                    say('WhatsApp process not found. Make sure WhatsApp desktop is running before installing dark mode.');
                    hideOL();
                    started = false;
                }
            }

        }
    });
}

function applyDarkStyles(procPath) {
    console.log('\x1b[33m%s\x1b[0m', 'TIP: You can create/download custom themes using "override.json" (Instructions are in the documentation)\n');

    try {
        let dir = path.dirname(procPath);
        let fullpath = path.join(dir, 'resources', 'app.asar');

        if (platform === 'darwin') {
            fullpath = procPath;
        }

        setOLTxt('Backing up..');
        fs.copySync(fullpath, bkPath);

        setOLTxt('Extracting..');
        let extPath = path.join(__dirname, 'extracted');
        asar.extractAll(fullpath, extPath);

        setOLTxt('Injecting styles..');
        let stylePath = path.join(__dirname, 'styles', platform);
        if (fs.existsSync(path.join(extPath, 'index.html'))) {
            try {
                fs.copySync(stylePath, extPath);
                let newAsar = path.join(__dirname, 'app.asar');
                asar.createPackage(extPath, newAsar, function () {
                    setOLTxt('Replacing files..');
                    try {
                        fs.copySync(newAsar, fullpath);

                        setOLTxt('Cleaning up..');
                        fs.removeSync(extPath);
                        fs.removeSync(newAsar);

                        let bkPath = path.join(__dirname, 'styles', platform, 'bk');

                        fs.copySync(path.join(bkPath, 'dark.css'), path.join(stylePath, 'dark.css'));
                        fs.copySync(path.join(bkPath, 'index.html'), path.join(stylePath, 'index.html'));
                        fs.removeSync(bkPath);

                        say('All done. May your beautiful eyes burn no more.. Enjoy WhatsApp Dark mode!! :)');

                        let WAPP = spawn(execPath, [], {
                            detached: true,
                            stdio: ['ignore', 'ignore', 'ignore']
                        });
                        WAPP.unref();
                        startInit();
                        started = false;
                    } catch (error) {
                        console.log(error);
                        setOLTxt('An error occurred. Cleaning up..');
                        fs.removeSync(extPath);
                        fs.removeSync(newAsar);
                        startInit();
                        started = false;
                    }
                });
            } catch (error) {
                console.log(error);
                hideOL();
                started = false;
            }
        } else {
            say('\x1b[31m%s\x1b[0m', 'Failed to extract WhatsApp source.');
            hideOL();
            started = false;
        }
    } catch (error) {
        console.log(error);
        hideOL();
        started = false;
    }
}

function overrideStyles() {
    let stylePath = path.join(__dirname, 'styles', platform, 'dark.css');
    let htmlPath = path.join(__dirname, 'styles', platform, 'index.html');
    let bkPath = path.join(__dirname, 'styles', platform, 'bk');

    fs.copySync(stylePath, path.join(bkPath, 'dark.css'));
    fs.copySync(htmlPath, path.join(bkPath, 'index.html'));

    fs.readJson(path.join(__dirname, 'override.json'), (error, ovrdJSONObject) => {
        if (!error) {
            getSelectedTheme(function (selTheme) {
                setOLTxt('Applying theme "' + selTheme + '"..');

                let ovrdJSON = ovrdJSONObject.find(x => x.themeName === selTheme);
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
                let win_title = ((ovrdJSON.win_title === undefined) ? 'var(--accent)' : ovrdJSON.win_title);
                let ctl_hover = ((ovrdJSON.ctl_hover === undefined) ? 'var(--darker)' : ovrdJSON.ctl_hover);
                let dark_title = ((ovrdJSON.dark_title === undefined) ? true : ovrdJSON.dark_title);

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
                        newStyle = newStyle.replace(/^.*--win_title:.*$/mg, "    --win_title: " + win_title + ";");
                        newStyle = newStyle.replace(/^.*--ctl_hover:.*$/mg, "    --ctl_hover: " + ctl_hover + ";");

                        if (dark_title === false) {
                            newStyle = newStyle.replace("background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));", "");
                        }

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
            applyDarkStyles(WAPath);
        }
    });
}

function restoreBackup(procPath) {
    setOLTxt('Restoring original version of the application...');
    started = true;
    let dir = path.dirname(procPath);
    let fullpath = path.join(dir, 'resources', 'app.asar');

    if (platform === 'darwin') {
        fullpath = procPath;
    }

    try {
        fs.copySync(bkPath, fullpath);

        say('All done. Make sure to let the developers know if something was wrong.. :)');
        let WAPP = spawn(execPath, [], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });
        WAPP.unref();
        hideOL();
        started = false;
    } catch (error) {
        say('An error occurred while restoring.');
        console.log(error);
        hideOL();
        started = false;
    }
}

function getThemes(callback) {
    showOL('Loading themes..');
    fs.readJson(path.join(__dirname, 'override.json'), (error, ovrdJSONObject) => {
        if (!error) {
            setThemeNames(ovrdJSONObject);
            callback();
        } else {
            say('Unable to read "override.json" file.');
            console.log(error);
            callback();
        }
    });
}

function openDownload() {
    (async () => {
        await open('https://github.com/m4heshd/whatsapp-desktop-dark/releases/latest');
    })();
}

function openInstaller() {
    (async () => {
        await open('http://127.0.0.1:3210/');
    })();
}

//Client functions
function setOLTxt(text) {
    client.emit('setOLTxt', text);
}

function showOL(text) {
    client.emit('showOL', text);
}

function hideOL() {
    client.emit('hideOL');
}

function setMacUI() {
    client.emit('setMacUI');
}

function setVersion(ver) {
    client.emit('setVersion', ver);
}

function setThemeNames(themes) {
    client.emit('setThemeNames', themes);
}

function endInit(isBkAvail) {
    client.emit('endInit', isBkAvail);
}

function ask(text, yes, no) {
    client.emit('ask', text, function (resp) {
        if (resp) {
            yes();
        } else {
            no();
        }
    });
}

function say(msg) {
    client.emit('say', msg);
}

function getSelectedTheme(callback) {
    client.emit('getSelectedTheme', function (resp) {
        callback(resp);
    });
}