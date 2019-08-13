const path = require("path");
const {fork} = require("child_process");
let task = null;

switch (process.platform) {
    case 'win32':
        task = fork(path.join(__dirname, 'run-win32.js'));
        break;
    case 'darwin':
        task = fork(path.join(__dirname, 'run-darwin.js'));
        break;
    default:
        console.log('\x1b[31m%s\x1b[0m', 'This platform is not supported.\n');
}

task.on('error', function (err) {
    console.log(err);
    console.log('\x1b[31m%s\x1b[0m', 'An error occurred in the process.\n');
});
task.on('exit', function () {
    process.stdout.write('Press any key to exit.. ');

    try {
        process.stdin.setRawMode(true);
    } catch (error) {

    }
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
});