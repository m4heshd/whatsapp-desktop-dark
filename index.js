const ps = require('ps-node');

console.log('\x1b[4m\x1b[1m\x1b[36m%s\x1b[0m', '\n~~~~ WhatsApp Desktop Dark Mode by m4heshd ~~~~\n\n');

ps.lookup({
    command: 'WhatsApp.exe', //Need to add support for other platforms
    psargs: 'ux'
}, function (err, resultList) {
    if (err) {
        console.log(err);
    } else {
        if (resultList.length) {
            console.log('Please close WhatsApp and wait for the process to continue..');
        } else {
            console.log('\x1b[31m%s\x1b[0m', 'WhatsApp process not found. Make sure WhatsApp desktop is running before installing dark mode.');
        }

    }
});