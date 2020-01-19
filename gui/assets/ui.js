//Elements
let overlay = document.querySelector("#overlay");
let txtOL = document.querySelector("#txtOL");

//Incoming messages
socket.on('showOL', function (data) {
    showOL(data);
});

socket.on('hideOL', function () {
    hideOL();
});

socket.on('setOLTxt', function (data) {
    setOLTxt(data);
});

socket.on('ask', function (data, fn) {
    fn(confirm(data));
});

//UI Functions
function showOL(text) {
    if (text) {
        txtOL.innerHTML = text;
    }
    overlay.style.opacity = "1";
    overlay.style.visibility = "visible";
}

function hideOL() {
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
}

function setOLTxt(text) {
    txtOL.innerHTML = text;
}