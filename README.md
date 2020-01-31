
<h1 align="center">
  <br>
<img src="https://i.ibb.co/SJjdwmF/banner-logo.png" alt="WhatsApp Desktop Dark Mode by m4heshd">
  <br>
WhatsApp Desktop Dark Mode by <a href="https://github.com/m4heshd">m4heshd</a>
  <br>
<img src="https://img.shields.io/github/downloads/m4heshd/whatsapp-desktop-dark/total.svg?label=Downloads&logo=WhatsApp&color=5792ff&logoColor=5792ff&labelColor=272c35" alt="Total downloads" height="25.2">
<a href="https://github.com/m4heshd/whatsapp-desktop-dark/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/m4heshd/whatsapp-desktop-dark?label=Issues&logo=github&color=5792ff&logoColor=5792ff&labelColor=272c35" alt="Closed issues" height="25.2">
</a>
<a href="https://t.me/wadarkmodechat" target="_blank">
    <img src="https://img.shields.io/static/v1?label=Telegram%20Chat&logo=Telegram&color=5792ff&logoColor=5792ff&labelColor=272c35&message=Join" alt="Join the chat on Telegram" height="25.2">
</a>
  <br>
</h1>

Stable version: [**`0.4.315`**](https://github.com/m4heshd/whatsapp-desktop-dark/releases/tag/0.4.315) (Check if this version matches with your version of WhatsApp. The mod will still work even if the versions doesn't match)

This mod is a simple tweak for [WhatsApp Desktop **Official** version](https://www.whatsapp.com/download/) to make it look awesomely dark.

<span color="red">⚠ **Please note that this script won't work with Microsoft store or App store version of WhatsApp desktop. You need to use the direct downloaded version linked above**  </span>
<h4 align="center"> Windows <h4>

![WhatsApp Desktop Dark Mode Windows](https://i.ibb.co/fnrk4p4/Screenshot.png)

<h4 align="center"> macOS <h4>

![WhatsApp Desktop Dark Mode Mac](https://i.ibb.co/hy333DT/Screenshot-mac.png)

### DISCLAIMER:
> **This is not an official version of WhatsApp Desktop Dark mode. So make sure to read through this document before you use this mod because i won't be responsible for any damage you've done yourself trying to install this mod (It's not even that hard 🙄). The coding/styling behind this tweak has full transparency since I've made it open-source right here.**

# Is this safe?
The answer is right there on the top. **This is an open source project**. which literally means that you can see through the source code of this mod. So **I CANNOT STEAL YOUR MESSEGES, I CANNOT TAP INTO YOUR CALLS**. If you're like one of the "Anti-Vaccination" parents, please avoid using this mod. Wouldn't you rather use the official WhatsApp version with a simple tweak like this than using some random third-party app just to have a proper dark UI?

**NOTE:** This script will not replace any of the functionality related coding inside WhatsApp. Just the styling.

# Downloads

**NOTE:** *THIS IS NOT A MODDED VERSION OF WhatsApp*. WhatsApp Desktop Dark Mode is a simple set of styling that needs to be injected to the source files of your current installation of WhatsApp. I've made it much easier by creating a installation script using NodeJS and made it easier furthermore by creating simple executable files using [nexe](https://github.com/nexe/nexe). If you don't trust the executable files I've provided below, you can build and run it from the source code itself by following the instructions in the next section.

 - [All releases (with source)](https://github.com/m4heshd/whatsapp-desktop-dark/releases)
 - Windows (x86 & x64) - [Download](https://github.com/m4heshd/whatsapp-desktop-dark/releases/download/0.4.315/WADark-0.4.315-Windows.zip)
 -  macOS (x64) - [Download](https://github.com/m4heshd/whatsapp-desktop-dark/releases/download/0.4.315/WADark-0.4.315-macOS.zip)

## Installation

Make sure you have [WhatsApp Desktop](https://www.whatsapp.com/download/) installed in your PC or mac first.

⚠ **Please note that this script won't work with Microsoft store or App store version of WhatsApp desktop. You need to use the direct downloaded version linked above**

Simply extract the downloaded ZIP file and run `WADark.exe` or `WADark` in the root of extracted directory. Make sure WhatsApp Desktop is running before you start the installation. Then wait for the process to finish. That's it.

⚠ **GUI installer is still in beta stage and might contain bugs. If you want to run the legacy commandline version, run with `cli` argument. `WADark.exe cli` for Windows and `WADark cli` for macOS.**

**NOTE:** It's recommended not to delete the script folder after the installation because the script automatically creates a backup of your original WhatsApp source in case you need to revert back to the original version.

## Custom Themes

You can find all the resources and theming related documentation [right here](https://github.com/m4heshd/whatsapp-desktop-dark/tree/master/themes).

### How to remove the mod?
Simply rerun the script and it will ask you to restore the backup made by any previous installations. (Or use the button on top left to switch to light mode)

### My WhatsApp turned back to light theme after sometime. What to do?
This means that your WhatsApp build is probably auto updated to a newer version. Rerun the script and It'll tell you if a new version is available. Even if the dark mode version is not updated, just rerun the script and install the dark mode again.

# Build the installation script yourself

Building process is really simple even if you're not a pro developer. You will just need [NodeJS](https://nodejs.org) and [NPM](https://www.npmjs.com/) (Usually packed with NodeJS) installed on your computer to build and run the script yourself.

Clone or download this repository, `cd` to that directory and enter the following commands to start the script. There are two methods you can run the script.

**Method 1 (Build binaries)**

 1. `npm install`  (Wait for this to finish)
 2. `npm run dist-win` (Windows) or `npm run dist-mac` (macOS)
 3. Finally locate and run the binary file created in `dist/$PLATFORM/` directory.

**Method 2 (Run directly from source)**

 1. `npm install`  (Wait for this to finish)
 2. `npm run run-gui` for GUI installer or `npm run run-cli` for CLI installer

Simple as that.

# Support this project

Involvement as a contributor by adding a few lines of code, fixing a bug, responding to issues, testing etc.. would be one of the most helpful methods you could support the project. If you're not a programmer but a generous person, you can send a small donation this way buy clicking the following button.

[![Donate to m4heshd](https://i.ibb.co/3vQTMts/paypal-donate-icon-7.png)](https://www.paypal.me/mpwk?locale.x=en_US)

Or you can buy me a "ko-fi" by clicking this button

[![ko-fi](https://i.ibb.co/QmQknmc/ko-fi.png)](https://ko-fi.com/m4heshd)

# Got an Issue?

There can be a numerous amount of issues in the mod since I can't be testing every single corner in the styles of this huge program. That specially applies to macOS version because I'm doing all the mac development and testing on a macOS VM.

[Follow this link](https://github.com/m4heshd/whatsapp-desktop-dark/issues) to submit your issues and please remember to be descriptive when submitting issues. Also don't forget to attach a small screenshot if the issue is style/GUI related.

# Known issues

**Windows:**

 - Automatically killing the WhatsApp process might take a little time or the process might repeat itself [`unfixable/SW-HW dependent`]

# Changelog

Style changelog is available [here](changelog.txt).

# License
"WhatsApp Desktop Dark Mode by m4heshd" is licensed under [MIT License](LICENSE). So you are allowed to use freely and modify the application. I will not be responsible for any outcome. Proceed with any action at your own risk.
