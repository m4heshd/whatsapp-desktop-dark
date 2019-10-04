# Theming WhatsApp Desktop

You can simply create or place a file named `override.json` with a few valid json key-value pairs right next to script executable (`WADark.exe` or `WADark`) and run the script to install dark mode with the default theme overridden.

## Why "`override.json`"?

The simplest answer to this would be that using `override.json` is much easier than messing with a large stylesheet. Also the best feature would be that these themes won't be broken after each update and will also be backwards compatible.

## Downloading Themes

Select any theme you wish to install from above directory list and download the corresponding `override.json` file from inside the selected theme directory. Place that file right next to your script executable and run the script. Replace the file if already exists. It should tell you the installed theme name in the process which means that it worked.

## Creating a new theme

It's really simple to create a new theme. You won't need any kind of programming knowledge to do this. [JSON file structure](https://www.w3resource.com/JSON/structures.php) is really simple and easy to edit.

To start, take the [`override.json`](https://github.com/m4heshd/whatsapp-desktop-dark/blob/master/themes/default/override.json) file from 'Deafult' theme as a boilerplate structure for your new theme. Give your theme a good name. Make sure not to use a name that's already in the themes library right here. You can edit the values as you go by keeping it next to script executable and reinstalling to test new edits. Color values must be valid CSS colors or else you may end up with a broken WhatsApp UI.

### How to publish my theme?

You need to fork this repository and create a new directory for your theme inside themes directory in the root of this repo. Unlike the theme name from `override.json`, the directory name should not contain **uppercase letters** or **spaces**. But the directory name should comply with the theme name. Create the `override.json` file inside that direcotry and start working on your theme. Make sure to do proper commits for updates and the final commit should look like "**Add "`$YOUR_THEME_NAME`" theme**".

Once you have finished creating your theme, just create a new pull request on GitHub. Add a screenshot to the pull request description if possible. That's it. Your theme will be tested and added to the library soon after that.