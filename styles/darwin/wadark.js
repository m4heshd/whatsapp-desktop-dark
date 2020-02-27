function waitFor(selector) {
    return new Promise(function (res) {
        waitForElementToDisplay(selector, 800);
        function waitForElementToDisplay(selector, time) {
            if (document.querySelector(selector) != null) {
                res();
            }
            else {
                setTimeout(function () {
                    waitForElementToDisplay(selector, time);
                }, time);
            }
        }
    });
}

function addBtn() {
    let switchBtn = '<div class="_3j8Pd"><div role="button" id="wadark" title="Switch themes (WADark/Official Dark/Light)"><span data-icon="dark-switch"><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path xmlns="http://www.w3.org/2000/svg" d="M 2.710938 15.820312 L 2.710938 18.5 C 2.710938 20.019531 3.949219 21.261719 5.46875 21.261719 L 8.148438 21.261719 L 10.050781 23.160156 C 10.570312 23.679688 11.269531 23.96875 12 23.96875 C 12.730469 23.96875 13.429688 23.679688 13.949219 23.160156 L 15.851562 21.261719 L 18.53125 21.261719 C 20.050781 21.261719 21.289062 20.019531 21.289062 18.5 L 21.289062 15.820312 L 23.191406 13.921875 C 23.710938 13.398438 24 12.699219 24 11.96875 C 24 11.238281 23.710938 10.539062 23.191406 10.019531 L 21.289062 8.121094 L 21.289062 5.441406 C 21.289062 3.917969 20.050781 2.679688 18.53125 2.679688 L 15.851562 2.679688 L 13.949219 0.78125 C 12.910156 -0.261719 11.089844 -0.261719 10.050781 0.78125 L 8.148438 2.679688 L 5.46875 2.679688 C 3.949219 2.679688 2.710938 3.917969 2.710938 5.441406 L 2.710938 8.121094 L 0.808594 10.019531 C 0.289062 10.539062 0 11.238281 0 11.96875 C 0 12.699219 0.289062 13.398438 0.808594 13.921875 Z M 12 5.96875 C 12.800781 5.96875 13.570312 6.121094 14.28125 6.398438 C 14.570312 6.519531 14.75 6.800781 14.75 7.101562 C 14.75 7.410156 14.558594 7.691406 14.269531 7.800781 C 12.691406 8.417969 11 9.839844 11 11.96875 C 11 14.101562 12.691406 15.519531 14.269531 16.140625 C 14.558594 16.25 14.75 16.53125 14.75 16.839844 C 14.75 17.140625 14.570312 17.421875 14.28125 17.539062 C 13.570312 17.820312 12.800781 17.96875 12 17.96875 C 8.519531 17.96875 6 15.449219 6 11.96875 C 6 8.488281 8.519531 5.96875 12 5.96875 Z M 12 5.96875 " fill="currentColor"></path></svg></span></div><span></span></div>';

    document.querySelector('._3j8Pd').parentElement.insertAdjacentHTML('afterbegin', switchBtn);

    document.getElementById("wadark").onclick = function () {
        let isDisabled = document.styleSheets[1].disabled;
        let isOfficialDark = document.body.classList.contains('dark');

        if (isDisabled) {
            if (isOfficialDark) {
                document.body.classList.remove('dark');
            } else {
                document.styleSheets[1].disabled = false;
            }
        } else {
            document.body.classList.add('dark');
            document.styleSheets[1].disabled = true;
        }
    };
}

waitFor('._3j8Pd').then(addBtn);