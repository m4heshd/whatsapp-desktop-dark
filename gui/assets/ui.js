//Elements
let overlay = document.querySelector("#overlay");
let txtOL = document.querySelector("#txtOL");
let btnRestore = document.querySelector('#btnRestore');
let btnInstall = document.querySelector('#btnInstall');
let lblVersion = document.querySelector('#lblVersion');
let cmbTheme = document.querySelector('#cmbTheme');

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

socket.on('setVersion', function (data) {
    setVersion(data);
});

socket.on('ask', function (data, fn) {
    fn(confirm(data));
});

socket.on('getSelectedTheme', function (fn) {
    let selected = cmbTheme.options[cmbTheme.selectedIndex].value;
    fn(selected);
});

socket.on('say', function (data) {
    alert(data);
});

socket.on('setThemeNames', function (data) {
    setThemeNames(data);
});

socket.on('endInit', function (data) {
    endInit(data);
});

socket.on('disconnect', reason => {
    console.log(`reason: ${reason}`);
});

//UI element events
btnInstall.addEventListener("click", function () {
    showOL("Starting installation..");
    socket.emit('startInstall');
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

function setVersion(text) {
    lblVersion.innerHTML = text;
}

function setThemeNames(themes) {
    document.querySelectorAll('#cmbTheme option').forEach(option => option.remove());
    themes.forEach(function (theme) {
        let opt = document.createElement("option");
        opt.text = theme;
        opt.value = theme;
        cmbTheme.options.add(opt);
    });
    document.querySelector('#cmbTheme option[value="Default"]').selected = true;
}

function endInit(isBkAvail) {
    isBkAvail ? btnRestore.removeAttribute("disabled") : btnRestore.setAttribute("disabled", true);
    hideOL();
}