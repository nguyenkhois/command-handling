'use strict';

/**
 * The command line syntax
 * $ command [option] [sub-option] [argument]
 *
 * An option has:
 *  - Many sub options
 *  - Only an alias
 */

const { Command } = require("../");

const command = new Command();

command
    .option("-g", "--git", "Run git init and generate a .gitignore file")
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View the help information")
    .option("-cf", "--config", "Config for this app")
    .option("-m", "--my-asset", "Retrieve assets from a specific directory")
    .subOption("-g", "--no-install", "No install dependencies")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path");

//const result = command.parse(process.argv);
const { mainFlag, subFlags, argument, commandLength } = command.parse(process.argv);

switch (mainFlag) {
    case "-g":
        if (argument.length > 0) {
            console.log("Executing argument \x1b[33m%s\x1b[0m...", argument);
        }

        break;

    case "-v":
        showVersion();
        break;

    case "-help":
        const optionList = command.showOptions();
        showHelpInformation(optionList);

        break;

    case "-cf":
        if (commandLength > 2 && subFlags.length > 0) {
            console.log("Executing config command by sub flag(s) \x1b[33m%s\x1b[0m...", subFlags);
        }

        break;

    default:
        console.log("Nothing to do! :-)");
        break;
}


// YOUR OWN FUNCTIONS
function showVersion(){
    console.log("Version 1.0.0");
}

function showHelpInformation(optionList) {
    console.log("\nOPTIONS:");
    optionList.map((option) => {
        console.log(`${option.flag}, \x1b[90m${option.alias}\x1b[0m\t${option.description}`);
    });
}