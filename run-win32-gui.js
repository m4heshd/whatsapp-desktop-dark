let path = require('path');
let express = require('express');
let xApp = express();
let io = require('socket.io');

xApp.use(express.static(path.join(__dirname, 'gui')));

let xServ = xApp.listen(3210, function () {
    console.log('WADark GUI installer backend started');
});

io = io(xServ);
io.on('connection', function(socket){
    console.log('WADark installer client connected');
});
