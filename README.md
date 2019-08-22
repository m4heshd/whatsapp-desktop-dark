
<h1 align="center">
  <br>
<img src="https://i.ibb.co/SJjdwmF/banner-logo.png" alt="WhatsApp Desktop Dark Mode by m4heshd">
  <br>
WhatsApp Desktop Dark Mode by <a href="https://github.com/m4heshd">m4heshd</a>
</h1>

Stable version: [**`0.3.4375`**](https://github.com/m4heshd/whatsapp-desktop-dark/releases/tag/0.3.4375) (Check if this version matches with your version of WhatsApp. The mod will still work even if the versions doesn't match)

This mod is a simple tweak for WhatsApp Desktop **Official** version to make it look awesomely dark.
<h4 align="center"> Windows <h4>

![WhatsApp Desktop Dark Mode Windows](https://i.ibb.co/fnrk4p4/Screenshot.png)

<h4 align="center"> macOS <h4>

![enter image description here](https://i.ibb.co/hy333DT/Screenshot-mac.png)

### DISCLAIMER:
> **This is not an official version of WhatsApp Desktop Dark mode. So make sure to read through this document before you use this mod because i won't be responsible for any damage you've done yourself trying to install this mod (It's not even that hard 🙄). The coding/styling behind this tweak has full transparency since I've made it open-source right here.**

# Is this safe?
The answer is right there on the top. **This is an open source project**. which litterally means that you can see through the source code of this mod. So **I CANNOT STEAL YOUR MESSEGES, I CANNOT TAP INTO YOUR CALLS**. If you're like one of the "Anti-Vaccination" parents, please avoid using this mod. Wouldn't you rather use the official WhatsApp version with a simple tweak like this than using some random third-party app just to have a proper dark UI?

**NOTE:** This script will not replace any of the functionality related coding inside WhatsApp. Just the styling.

# Downloads

**NOTE:** *THIS IS NOT A MODDED VERSION OF WhatsApp*. WhatsApp Desktop Dark Mode is a simple set of styling that needs to be injected to the source files of your current installation of WhatsApp. I've made it much easier by creating a installation script using NodeJS and made it easier furthermore by creating a simple executable file using [nexe](https://github.com/nexe/nexe). If you don't trust the executable I've provided below, you can build and run it from the source code itself by following the instructions in the next section.

 - [All releases (with source)](https://github.com/m4heshd/whatsapp-desktop-dark/releases)
 - Windows (x86 & x64) - [Download](ADD_LINK)
 -  macOS (x64) - [Download](ADD_LINK)

Download the corresponding file for your OS and extract the zip file. Then simply run the `WADark.exe` or `WADark` and wait for the process to finish. That's it.

## Installation
Simply extract the downloaded ZIP file and run the `WADark.exe` or `WADark` in the root of extracted directory. Make sure WhatsApp Desktop is running before you start the installation. Then wait for the process to finish. That's it.

**NOTE:** It's recommended not to delete the script folder after the installation because the script automatically creates a backup of your original WhatsApp source in case you need to revert back to the original version.

### How to remove the mod?
Simply rerun the script and it will ask you to restore the backup made by any previous installation.

# Build the installation script yourself

Building process is really simple even if you're not a pro developer. You will just need [NodeJS](https://nodejs.org) and [NPM](https://www.npmjs.com/) (Usually packed with NodeJS) installed on your computer to build and run the script yourself.

Clone this repository, `cd` to that directory and enter the following commands to start the script. There are two methods you can run the script.

**Method 1 (Build binaries)**

 1. `npm install`  (Wait for this to finish)
 2. `npm run dist-win` (Windows) or `npm run dist-mac` (macOS)
 3. Finally locate and run the binary file created in `dist/$PLATFORM/` directory.

**Method 2 (Run directly from source)**

 1. `npm install`  (Wait for this to finish)
 2.  `node .`

Simple as that.

# Support this project

Involvement as a contributor by adding a few lines of code, fixing a bug, responding to issues, testing etc.. would be one of the most helpful methods you could support the project. If you're not a programmer but a generous person, you can send a small donation this way buy clicking the following button.

[![Donate to m4heshd](https://i.ibb.co/3vQTMts/paypal-donate-icon-7.png)](https://www.paypal.me/mpwk?locale.x=en_US)

Or you can buy me a "ko-fi" by clicking this button

[![ko-fi](https://i.ibb.co/QmQknmc/ko-fi.png)](https://ko-fi.com/m4heshd)

# Got an Issue?

There can be a numerous amount of issues in the mod since I can't be testing every single corner in the styles of this huge program. That specially applies to macOS version because I'm doing all the mac development and testing on a macOS VM. [Follow this link](https://github.com/m4heshd/whatsapp-desktop-dark/issues) to submit your issues and please remember to be descriptive when submitting issues. Also don't forget to attach a small screenshot if the issue is style/GUI related.

# Known issues

**Windows:**

 - Automatically killing the WhatsApp process might take a little time or the process might repeat itself [`unfixable/SW-HW dependent`]
 - Console inputs might be typed twice [`NodeJS issue/Need to wait for an update`]

# Changelog

Style changelog is available [here](changelog.txt).

# License
"WhatsApp Desktop Dark Mode by m4heshd" is licensed under [MIT License](LICENSE). So you are allowed to use freely and modify the application. I will not be responsible for any outcome. Proceed with any action at your own risk.
