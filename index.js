
console.log('\x1b[40m\x1b[4m\x1b[1m\x1b[36m%s\x1b[0m', '\n~~~~ WhatsApp Desktop Dark Mode by m4heshd ~~~~\n\n');

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