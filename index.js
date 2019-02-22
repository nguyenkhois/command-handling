'use strict';

// Option constructor
function Option(flag, alias, description) {
    this.flag = flag;
    this.alias = alias || "";
    this.description = description || "";
    this.subFlags = [];
}

// Command constructor
function Command() {
    this.options = [];
}

// Command prototypes
Command.prototype.option = function (flag, alias, description) {
    // Error handling
    if (flag === undefined || flag === null || flag === "") {
        throw (new Error("Missing the parameter: flag"));
    }

    const flagIndex = this.options.findIndexByProperty("flag", flag);

    // If the main flag is not found -> add new
    if (flagIndex === -1) {
        const newOption = new Option(flag, alias, description);
        this.options = this.options.concat([newOption]);
    } else {
        throw (new Error(`Duplicate the main flag ${flag}`));
    }

    return this;
};

Command.prototype.subOption = function (mainFlag, subFlag, description) {
    // Error handling
    if (mainFlag === undefined || mainFlag === null || mainFlag === "") {
        throw (new Error("Missing the parameter: mainFlag"));
    } else if (subFlag === undefined || subFlag === null || subFlag === "") {
        throw (new Error("Missing the parameter: subFlag"));
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
            throw (new Error(`Duplicate the sub flag ${subFlag}`));
        }
    } else {
        throw (new Error(`The main flag ${mainFlag} is not defined yet`));
    }

    return this;
};

Command.prototype.parse = function (processArgv) {
    // Error handling
    if (processArgv === undefined || processArgv === null || !Array.isArray(processArgv)) {
        throw (new Error("Missing the parameter: processArgv. It must be an array of argument(s)"));
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
    const commandArr = processArgv.slice(2, process.argv.length) || [];
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
            if (inputArg.indexOf("-") === 0) {
                return true;
            }

            return false;
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
        if (betweenArgument !== null && betweenArgument.length > 0) {
            betweenArgument.map((item) => {
                if (supportedSubFlags.indexOf(item) > -1) {
                    storeSubFlag(item);
                } else {
                    storeUnknown(item);
                }
            });
        }

        // Process the last argument
        if (argument === null && lastArgument !== null) {
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
        if (mainFlag !== null) {
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
            "subFlags": mainFlag !== null ? filteredSubFlag : subFlags,
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

// Support functions
Array.prototype.findIndexByProperty = function (sPropertyName, sPropertyValue) {
    try {
        return this.findIndex(objItem => objItem[sPropertyName] === sPropertyValue);
    } catch (err) { return err; }
};

function optionIdentification(inputArg, optionArr) {
    const flagPosition = inputArg.indexOf("-");
    let howToFind = -1;

    if (flagPosition === 0) {
        if (inputArg.indexOf("-", 1) === 1) {
            howToFind = 1; // Try to identify sub flag "--"
        } else {
            howToFind = 0; // Try to identify main flag "-"
        }
    } else {
        return -1; // Exit immediately this function
    }

    switch (howToFind) {
        case 0: // Find by main flag
            const seekingMainFlag = optionArr.filter(objItem => objItem["flag"] === inputArg);
            if (seekingMainFlag.length > 0) {
                return seekingMainFlag[0].flag;
            }

            break;

        case 1: // Find by sub flag
            const seekingAliasFlag = optionArr.filter(objItem => objItem["alias"] === inputArg);
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