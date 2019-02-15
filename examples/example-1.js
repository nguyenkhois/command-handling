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
    //.option("-g", "--git", "Run git init and generate a .gitignore file") // Duplicate testing
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View the help information")
    .option("-cf", "--config", "Config for this app")
    .option("-m", "--my-asset", "Retrieve assets from a specific directory")
    .subOption("-g", "--no-install", "No install dependencies")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    //.subOption("-cf", "--view-asset", "View the asset directory path") // Duplicate testing
    //.subOption("-cc", "--view-asset", "View the asset directory path") // Undefined testing
    .subOption("-cf", "--view-asset", "View the asset directory path");

const result = command.parse(process.argv);
const options = command.showOptions();

console.log(options);

console.log(`\n\n`);

console.log(result);