'use strict';

/**
 * The command line structure
 * $ command [option] [sub-option] [argument]
 *
 * An option has:
 *  - Many sub options
 *  - Only an alias
 */

// const { Command } = require("command-handling");
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
const { mainFlag, subFlags, argument, commandLength, unknowns } = command.parse(process.argv);

switch (mainFlag) {
    case "-g":
        // Run command "node example-3.js -g something"
        if (argument && unknowns && unknowns.length === 0) {
            console.log("Executing argument \x1b[33m%s\x1b[0m...", argument);
        } else {
            console.log("Unknown command");
        }

        break;

    case "-v":
        // Run command "node example-3.js -v"
        showVersion();
        break;

    case "-help":
        // Run command "node example-3.js -help"
        const optionList = command.showOptions();
        showHelpInformation(optionList);

        break;

    case "-cf":
        // Run command "node example-3.js -cf --view-asset
        if (commandLength > 1 && subFlags.length > 0) {
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
    let textOptions = "";
    let textSubOptions = "";

    optionList.map((option) => {
        textOptions += `${option.flag}, \x1b[90m${option.alias}\x1b[0m\t${option.description}\n`;

        if (option.subFlags.length > 0) {
            option.subFlags.map((subFlag, index) => {
                if (index === 0) {
                    textSubOptions += `${option.flag}`;
                }

                textSubOptions += `\t\x1b[90m${subFlag.flag}\x1b[0m\t${subFlag.description}\n`;
            });
        }
    });

    console.log("\nOPTIONS:");
    console.log(textOptions);

    console.log("\nSUB OPTIONS:");
    console.log(textSubOptions);
}