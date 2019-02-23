# command-handling
[![Node.js version](https://img.shields.io/node/v/code-template-generator.svg?style=flat)](https://nodejs.org)   [![command-handling](https://img.shields.io/npm/v/command-handling.svg?style=flat)](https://www.npmjs.com/package/command-handling/)

## Table of contents
1. [Introduction](#1-introduction)
2. [How to use](#2-how-to-use)
    * [Installation](#installation)
    * [Command line structure](#command-line-structure)
    * [Methods](#methods)
    * [Data structures](#data-structures)
    * [Usage](#usage)
3. [Examples](#3-examples)
4. [Thank you!](#4-thank-you)

## 1. Introduction
![How it works](./assets/howitworks.png)

This is a lightweight library that is using for Node.js CLI app. This library is also using for the project [code-template-generator](https://www.npmjs.com/package/code-template-generator).

You should be using `command-handling` for a small CLI application that has not many complex features. You can view [Commander.js](https://github.com/tj/commander.js) if you are thinking about a great Node.js CLI application.

`command-handling` help you analyse a command line that entered by an end-user. It analyses the command line and catches the arguments that you may be waiting for then you decide what you want to do with the raw data after parsing.

## 2. How to use
### Installation
```
$ npm install --save command-handling
```

### Command line structure
The simple command line structure is used in this library:

`$ command [-option][--alias] [--sub-option] [argument]`

* An option has only an alias.
* An option has many sub options.
* Use cases:
    * `command` (only command without anything)
    * `command [argument]`
    * `command [-option][--alias]`
    * `command [-option][--alias] [argument]`
    * `command [-option][--alias] [--sub-option]`
    * `command [-option][--alias] [--sub-option] [argument]`
    * `command [--sub-option] [argument]`

__Tips!__ View the examples for [code-template-generator](https://www.npmjs.com/package/code-template-generator#5-examples) to know more about how I have used the library in another project.

### Methods
|Method|Argument|Description|
|---|---|---|
|`.option()`|`<flag>, [alias], [description]`|Option definition|
|`.subOption()`|`<mainFlag>, <subFlag>, description`|Sub option definition|
|`.showOptions()`|-|It returns an option list in an object array|
|`.parse()`|`<process.argv>`|Parse the command line|

You can use method chaining for these methods:
* `option`
* `subOption`
* `parse` <- This method must be in the end of chaining.

_Tip! View the [examples](#3-examples) for more details._

### Data structures

![Command structure](./assets/command-structure.png)

1. An object is returned when you call the method `.parse(process.argv)`. You need this object for your coding.

```
{   // The default result structure
    mainFlag: null,
    subFlags: [],
    argument: null,
    commandLength: 0,
    unknowns: []
}
```

2. An object array is returned when you call the method `.showOptions()`. You may want to have an option list for your help function.

```
[   // All options
    {   // Option 1
        flag: '',     // It's mean the main flag
        alias: '',
        description: '',
        subFlags: [
            {
                flag: '', // Sub flag 1
                description: ''
            },
            {
                flag: '', // Sub flag n
                description: ''
            }
        ]
    },
    {   // Option n
        ...
    }
]
```

_Tip! View the [examples](#3-examples) for more detail._

## Usage
* Step 1: Import the `Command` object from `command-handling` library.
   * `const { Command } = require('command-handling');`
* Step 2: Declare an object for your app. You decide its name.
   * `const command = new Command();`
* Step 3: You can use method chaining for your `command` object. You define all your options and sub options in this step:
    * Option: `.option(<flag>, [alias], [description])`
    * Sub option: `.subOption(<mainFlag>, <subFlag>, [description])`
* Step 4: Parse the command line and remember at this step is in the end of chaining. You have few ways to parse the command line:
   * `.parse(process.argv);` -> End of method chaining.
    * `const result = command.parse(process.argv);` -> Declare a separate variable to get back the result object that you need for your application.
* Extra: Using the method `.showOptions()` to get back an option list are defined above for your help function.
    * Example: `const optionList = command.showOptions();`

## 3. Examples
### Example 1

```
const { Command } = require('command-handling');
const command = new Command();

command
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View the help information")
    .option("-cf", "--config", "Config for this app")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path")
    .parse(process.argv); // Parsing is in the end of chaining

const optionList = command.showOptions();

console.log(optionList); // It returns an array with all defined options
```

### Example 2

```
const { Command } = require('command-handling');
const command = new Command();

command
    .option("-v", "--version", "View the installed version")
    .option("-h", "--help", "View help documentation")
    .option("-cf", "--config", "Config for this app")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path");

/* Parsing result is stored in a separate variable
const parsedCommand = command.parse(process.argv);
console.log(parsedCommand); */

// Another way for the command line parsing
const { mainFlag } = command.parse(process.argv);

switch (mainFlag) {
    case "-v":
        console.log("Version 1.0.0");
        break;

    case "-h":
        const optionList = command.showOptions();
        showHelpInformation(optionList);

        break;

    default:
        break;
}

function showHelpInformation(optionList){
    console.log("Welcome to help documentation");
    console.log(optionList); // Using for testing
}
```

View more the examples [here](https://github.com/nguyenkhois/command-handling/tree/master/examples).

## 4. Thank you!
Many thanks to [Commander.js](https://github.com/tj/commander.js) for the inspiration.
