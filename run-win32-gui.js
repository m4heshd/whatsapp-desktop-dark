const fs = require('fs-extra');
const request = require('https').request;
const {URL} = require('url');
const semver = require('semver');
const path = require('path');
const open = require('open');
const express = require('express');
const xApp = express();
let io = require('socket.io');

let client = null;
let version = '0';
let started = false;
let updURL = 'https://raw.githubusercontent.com/m4heshd/whatsapp-desktop-dark/master/package.json';

//Backend setup
xApp.use(express.static(path.join(__dirname, 'gui')));

let xServ = xApp.listen(3210, function () {
    console.log('WADark GUI installer backend started');
});

io = io(xServ);
io.on('connection', function(socket){
    if (!client){
        client = socket;
        console.log('WADark installer client connected');
        startInit();
    } else {
        console.log('Client connection rejected');
        socket.emit('setOLTxt', 'One instance of the process is already running.. Please restart if this is an error.');
    }
});

//Backend functions
function startInit() {
    showOL('Checking for updates..');
    fs.readJson(path.join(__dirname, 'info.json'), (error, infoJSON) => {
        if (!error) {
            version = infoJSON.version;
            // version = "0.3.4940";
            checkAppUpd();
        } else {
            console.log(error);
            if (!started) {
                // start();
                started = true;
            }
        }
    });
}

function checkAppUpd() {
    let req = request(new URL(updURL), function (res) {

        res.on('data', (d) => {
            let latest = JSON.parse(d.toString())["version"];
            if (semver.lt(version, latest)) {
                ask('A new update is available (v' + latest +'). Would you like to download?', openDownload, null);
            } else {
                if (!started) {
                    // start();
                    started = true;
                }
            }
        });
    });

    req.on('error', (e) => {
        console.log(e);
        if (!started) {
            // start();
            started = true;
        }
    });

    req.end();
}

function openDownload() {
    (async () => {
        await open('https://github.com/m4heshd/whatsapp-desktop-dark/releases/latest');
    })();
    // endApp();
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

function ask(text, yes, no) {
    client.emit('ask', text, function (resp) {
        if (resp) {
            yes();
        } else {
            no();
        }
    });
}