'use strict';

// The Option constructor
function Option(flag, alias, description) {
    this.flag = flag;
    this.alias = alias || "";
    this.description = description || "";
    this.subFlags = [];
}

// The Command constructor
function Command() {
    this.options = [];
}

// Command prototypes
Command.prototype.option = function (flag, alias, description) {
    if (!flag) {
        throw (new Error(`\x1b[31mMissing the parameter: flag\x1b[0m`));
    }

    const flagIndex = this.options.findIndexByProperty("flag", flag);

    // If the main flag is not found -> add new
    if (flagIndex === -1) {
        const newOption = new Option(flag, alias, description);
        this.options = this.options.concat([newOption]);
    } else {
        throw (new Error(`\x1b[31mDuplicate the main flag ${flag}\x1b[0m`));
    }

    return this;
};

Command.prototype.subOption = function (mainFlag, subFlag, description) {
    if (!mainFlag) {
        throw (new Error(`\x1b[31mMissing the parameter: mainFlag\x1b[0m`));
    } else if (!subFlag) {
        throw (new Error(`\x1b[31mMissing the parameter: subFlag\x1b[0m`));
    }

    const optionIndex = this.options.findIndexByProperty("flag", mainFlag);

    // The main flag must be found
    if (optionIndex > -1) {
        const subFlagIndex = this.options[optionIndex].subFlags.findIndexByProperty("flag", subFlag);

        // The sub flag is not found -> add new
        if (subFlagIndex === -1) {
            this.options[optionIndex].subFlags = this.options[optionIndex].subFlags.concat([{
                "flag": subFlag,
                "description": description
            }]);
        } else {
            throw (new Error(`\x1b[31mDuplicate the sub flag ${subFlag}\x1b[0m`));
        }
    } else {
        throw (new Error(`\x1b[31mThe main flag ${mainFlag} is not defined yet\x1b[0m`));
    }

    return this;
};

Command.prototype.parse = function (processArgv) {
    if (!processArgv || !Array.isArray(processArgv)) {
        throw (new Error(`\x1b[31mMissing the parameter: processArgv. It must be an array of argument(s)\x1b[0m`));
    }

    // Get all supported sub flags
    let supportedSubFlags = [];

    this.options.map((option) => {
        if (option.subFlags.length > 0) {
            option.subFlags.map((subFlag) => {
                if (supportedSubFlags.indexOf(subFlag.flag) === -1) {
                    supportedSubFlags = supportedSubFlags.concat([subFlag.flag]);
                }
            });
        }
    });

    // Begin parse the command line
    const commandArr = processArgv.slice(2);
    const commandLength = commandArr.length;
    let defaultReturn = {
        mainFlag: null,
        subFlags: [],
        argument: null,
        commandLength: 0,
        unknowns: []
    };

    if (commandLength > 0) {
        let mainFlag = null;
        let subFlags = [];
        let argument = null;
        let unknowns = [];

        const betweenArgument =
            commandLength > 2 ?
                commandArr.slice(1, commandLength - 1) :
                null;

        const lastArgument =
            commandLength > 1 ?
                commandArr[commandLength - 1] :
                null;

        // Sub functions
        function storeUnknown(arg) {
            if (unknowns.indexOf(arg) === -1 && arg !== null) {
                unknowns = unknowns.concat([arg]);
            }
        }

        function storeSubFlag(flag) {
            if (subFlags.indexOf(flag) === -1) {
                subFlags = subFlags.concat([flag]);
            }
        }

        function isLikeAnOption(inputArg) {
            return inputArg.charAt(0) === "-" ? true : false;
        }

        // Process the first argument
        const identifiedFirstArg = optionIdentification(commandArr[0], this.options);
        if (identifiedFirstArg !== -1) {
            /* Check if the user has used alias flag '--'
                Alias is converted to main flag */
            mainFlag = identifiedFirstArg;
        } else if (supportedSubFlags.indexOf(commandArr[0]) > -1) {
            // Check if it is a sub flag
            if (subFlags.indexOf(commandArr[0]) === -1) {
                subFlags = subFlags.concat([commandArr[0]]);
            }
        } else if (isLikeAnOption(commandArr[0])) {
            /* Check if the first argument has "-" character that look like an option
                but it is an unknown argument */
            storeUnknown(commandArr[0]);
        } else {
            // Waiting for a clean argument here
            argument = commandArr[0];
        }

        // Process the between arguments
        if (betweenArgument && betweenArgument.length > 0) {
            betweenArgument.map((item) => {
                if (supportedSubFlags.indexOf(item) > -1) {
                    storeSubFlag(item);
                } else {
                    storeUnknown(item);
                }
            });
        }

        // Process the last argument
        if (!argument && lastArgument) {
            if (supportedSubFlags.indexOf(lastArgument) > -1) {
                storeSubFlag(lastArgument);
            } else if (commandLength > 1) {
                /* Check if the last argument has "-" that look like an option
                    but it is an unknown argument */
                if (isLikeAnOption(lastArgument)) {
                    storeUnknown(lastArgument);
                } else {
                    argument = lastArgument;
                }
            }
        } else {
            storeUnknown(lastArgument);
        }

        /* Filter the sub flags by the main flag (if the main flag is found)
            before return the end result */
        let filteredSubFlag = [];
        if (mainFlag) {
            const optionIndex = this.options.findIndexByProperty("flag", mainFlag);
            if (optionIndex > -1) {
                const subFlagByMainFlag = this.options[optionIndex].subFlags;

                subFlags.map((item) => {
                    if (subFlagByMainFlag.findIndexByProperty("flag", item) > -1) {
                        filteredSubFlag = filteredSubFlag.concat([item]);
                    } else {
                        storeUnknown(item);
                    }
                });
            }
        }

        return Object.assign(defaultReturn, {
            "mainFlag": mainFlag,
            "subFlags": mainFlag ? filteredSubFlag : subFlags,
            "argument": argument,
            "commandLength": commandLength,
            "unknowns": unknowns
        });
    }

    return defaultReturn;
};

Command.prototype.showOptions = function () {
    return this.options;
};

// Helpers
Array.prototype.findIndexByProperty = function (sPropertyName, sPropertyValue) {
    try {
        return this.findIndex((objItem) => objItem[sPropertyName] === sPropertyValue);
    } catch (err) { return err; }
};

function optionIdentification(inputArg, optionArr) {
    let howToFind = -1;

    if (inputArg.charAt(0) === "-") {
        if (inputArg.charAt(1) === "-") {
            howToFind = 1; // Try to identify sub flag "--"
        } else {
            howToFind = 0; // Try to identify main flag "-"
        }
    } else {
        return -1; // Exit immediately this function
    }

    switch (howToFind) {
        case 0: // Find by main flag
            const seekingMainFlag = optionArr.filter((objItem) => objItem["flag"] === inputArg);
            if (seekingMainFlag.length > 0) {
                return seekingMainFlag[0].flag;
            }

            break;

        case 1: // Find by sub flag
            const seekingAliasFlag = optionArr.filter((objItem) => objItem["alias"] === inputArg);
            if (seekingAliasFlag.length > 0) {
                return seekingAliasFlag[0].flag;
            }

            break;

        default:
            return -1;
    }

    return -1; // Not found -> Unknown argument
}

module.exports = {
    Command
};