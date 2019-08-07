const ps = require('ps-node');
let WAPath = null;

console.log('\x1b[4m\x1b[1m\x1b[36m%s\x1b[0m', '\n~~~~ WhatsApp Desktop Dark Mode by m4heshd ~~~~\n\n');

checkProcess(null, false);

function checkProcess(proc, found) {
    ps.lookup({
        command: 'WhatsApp.exe', //Need to add support for other platforms
        psargs: 'ux'
    }, function (err, resultList) {
        if (err) {
            console.log(err);
        } else {
            if (resultList.length) {
                console.log('Wait for the application to kill WhatsApp and start the process.. (Close WhatsApp manually if not)');
                WAPath = resultList[0].command;
                killWhatsApp(resultList, checkProcess)
            } else {
                if (found) {
                    console.log('Start injection..');
                } else {
                    console.log('\x1b[31m%s\x1b[0m', 'WhatsApp process not found. Make sure WhatsApp desktop is running before installing dark mode.');
                }
            }

        }
    });
}

function killWhatsApp(procList, callafter) {
    let pid = procList[0].pid;
    ps.kill( pid, {timeout:30}, function( err ) {
        if (err) {
            // throw new Error( err );
            console.log('\x1b[31m%s\x1b[0m', 'Unable to kill WhatsApp. Please close WhatsApp manually.');
            callafter(null, true);
        }
        else {
            callafter(null, true);
        }
    });
}