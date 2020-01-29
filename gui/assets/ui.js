//Elements
let overlay = document.querySelector('#overlay');
let txtOL = document.querySelector('#txtOL');
let btnRestore = document.querySelector('#btnRestore');
let btnInstall = document.querySelector('#btnInstall');
let btnClose = document.querySelector('#btnClose');
let btnPaypal = document.querySelector('#btnPaypal');
let btnKofi = document.querySelector('#btnKofi');
let btnGithub = document.querySelector('#btnGithub');
let lblVersion = document.querySelector('#lblVersion');
let lblInfo = document.querySelector('#lblInfo');
let lnkCheckUpd = document.querySelector('#lnkCheckUpd');
let cmbTheme = document.querySelector('#cmbTheme');
let themes = [
    {
        "themeName": "Default",
        "dark": "#272c35",
        "darker": "#1f232a",
        "lighter": "#e9e9e9",
        "accent": "#5792ff",
        "msgout": "#131a25",
        "accent_hover": "#497ad5",
        "border": "#808080",
    }
];

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

socket.on('setMacUI', function () {
    lblInfo.innerHTML = '⚠ Make sure that you have WhatsApp Desktop installed in Applications directory';
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
btnInstall.addEventListener('click', function () {
    showOL('Starting installation..');
    socket.emit('startInstall');
});

btnRestore.addEventListener('click', function () {
    showOL('Starting restoration..');
    socket.emit('startRestore');
});

btnClose.addEventListener('click', function () {
    if (confirm('Are you sure you want to exit the installer?')) {
        quit();
    }
});

btnPaypal.addEventListener('click', function () {
    window.open('https://www.paypal.me/mpwk?locale.x=en_US', '_blank')
});

btnKofi.addEventListener('click', function () {
    window.open('https://ko-fi.com/m4heshd', '_blank')
});

btnGithub.addEventListener('click', function () {
    window.open('https://github.com/m4heshd/whatsapp-desktop-dark', '_blank')
});

cmbTheme.addEventListener('change', function () {
    let selected = cmbTheme.options[cmbTheme.selectedIndex].value;
    let ovrdJSON = themes.find(x => x.themeName === selected);

    document.documentElement.style.setProperty('--dark', ovrdJSON.dark);
    document.documentElement.style.setProperty('--darker', ovrdJSON.darker);
    document.documentElement.style.setProperty('--lighter', ovrdJSON.lighter);
    document.documentElement.style.setProperty('--accent', ovrdJSON.accent);
    document.documentElement.style.setProperty('--msgout', ovrdJSON.msgout);
    document.documentElement.style.setProperty('--accent_hover', pSBC(-0.3, ovrdJSON.accent));
    document.documentElement.style.setProperty('--border', pSBC(-0.7, ovrdJSON.lighter));
});

lnkCheckUpd.addEventListener('click', function () {
    socket.emit('checkUpd');
});

//UI Functions
function showOL(text) {
    if (text) {
        txtOL.innerHTML = text;
    }
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
}

function hideOL() {
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
}

function setOLTxt(text) {
    txtOL.innerHTML = text;
}

function setVersion(text) {
    lblVersion.innerHTML = text;
}

function setThemeNames(themeObject) {
    themes = themeObject;
    const themeNames = themeObject.map((ovrd) => ovrd.themeName);
    document.querySelectorAll('#cmbTheme option').forEach(option => option.remove());
    themeNames.forEach(function (theme) {
        let opt = document.createElement('option');
        opt.text = theme;
        opt.value = theme;
        cmbTheme.options.add(opt);
    });
    document.querySelector('#cmbTheme option[value="Default"]').selected = true;
}

function endInit(isBkAvail) {
    isBkAvail ? btnRestore.removeAttribute('disabled') : btnRestore.setAttribute('disabled', true);
    hideOL();
}

function quit() {
    let body = document.querySelector('body');
    body.innerHTML =
        '<div id="endScrn">\n' +
        '    <a href="https://github.com/m4heshd/whatsapp-desktop-dark" target="_blank">\n' +
        '        <img id="endImg" src="assets/wadark_med.png" alt="Visit on GitHub" onload="socket.emit(\'endApp\')">\n' +
        '        <br>\n' +
        '        <span id="endTxt">Visit on GitHub</span>\n' +
        '    </a>\n' +
        '</div>';
}

const pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        }
        return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? {
        r: 0,
        g: 0,
        b: 0,
        a: -1
    } : {r: 255, g: 255, b: 255, a: -1}, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
};