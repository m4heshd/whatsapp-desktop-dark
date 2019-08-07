const fs = require('fs-extra');
const asar = require('asar');
const path = require('path');
const {spawn} = require("child_process");
const ps = require('ps-node');
let WAPath = null;

console.log('\x1b[40m\x1b[4m\x1b[1m\x1b[36m%s\x1b[0m', '\n~~~~ WhatsApp Desktop Dark Mode by m4heshd ~~~~\n\n');

console.log('\x1b[33m%s\x1b[0m', 'This process takes at least a minute to complete. So please be patient and let it do the magic..');

checkProcess(false);

function checkProcess(found) {
    ps.lookup({
        command: 'WhatsApp.exe', //Need to add support for other platforms
        psargs: 'ux'
    }, function (err, resultList) {
        if (err) {
            console.log(err);
        } else {
            if (resultList.length) {
                console.log('Wait for the application to kill WhatsApp and start the process..');
                WAPath = resultList[0].command;
                killWhatsApp(resultList, checkProcess);
                // checkProcess(true)
            } else {
                if (found) {
                    startProcess(WAPath);
                } else {
                    console.log('\x1b[31m%s\x1b[0m', 'WhatsApp process not found. Make sure WhatsApp desktop is running before installing dark mode.');
                }
            }

        }
    });
}

function killWhatsApp(procList, callafter) {
    let pid = procList[0].pid;
    ps.kill( pid, {signal:'SIGTERM', timeout:30}, function( err ) {
        if (err) {
            // throw new Error( err );
            console.log('\x1b[31m%s\x1b[0m', 'Unable to kill WhatsApp. Please close WhatsApp manually.');
            callafter(true);
        }
        else {
            callafter(true);
        }
    });
}

function startProcess(procPath) {
    try {
        // console.log(procPath);
        let dir = path.dirname(procPath);
        let fullpath = path.join(dir, 'resources', 'app.asar');

        console.log('Backing up..');
        let bkPath = path.join(__dirname, 'backup', 'app.asar');
        fs.copySync(fullpath, bkPath);

        console.log('Extracting..');
        let extPath = path.join(__dirname, 'extracted');
        asar.extractAll(fullpath, extPath);

        console.log('Injecting styles..');
        let stylePath = path.join(__dirname, 'styles');
        if (fs.existsSync(path.join(extPath, 'index.html'))) {
            try {
                fs.copySync(stylePath, extPath);
                let newAsar = path.join(__dirname, 'app.asar');
                asar.createPackage(extPath, 'app.asar', function () {
                    console.log('Replacing files..');
                    try {
                        fs.copySync(newAsar, fullpath);
                        console.log('\x1b[32m%s\x1b[0m', '\nAll done. Enjoy WhatsApp Dark.. :)\n');
                        let WAPP = spawn(procPath, [], {
                            detached: true,
                            stdio: ['ignore', 'ignore', 'ignore']
                        });
                        WAPP.unref();
                        process.exit(0);
                    } catch (error) {
                        console.log(error);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'Failed to extract WhatsApp source.');
        }
    } catch (error) {
        console.log(error);
    }
}
