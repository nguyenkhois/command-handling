# command-handling
[![Node.js version](https://img.shields.io/node/v/code-template-generator.svg?style=flat)](https://nodejs.org)   [![code-template-generator](https://img.shields.io/npm/v/command-handling.svg?style=flat)](https://www.npmjs.com/package/command-handling/)

The lightweight Node.js command handling that is using for CLI app. This package is also using for [code-template-generator](https://www.npmjs.com/package/code-template-generator).

This package is using for small app that is not has many complex features. You can view [Commander.js](https://github.com/tj/commander.js) if you are thinking about a great Node.js CLI app.

## Table of contents
* [Introduction](#introduction)
* [Command line structure](#command-line-structure)
* [Methods](#methods)
* [Data structures](#data-structures)
* [Using](#using)
* [Example](#example)
* [Thank you!](#thank-you)

## Introduction
![How it works](./assets/howitworks.png)

`command-handling` help you to analyse the input command line. It catches the arguments that you may be waiting for then you decide what you want to do with the raw data after parsing.

## Command line structure
`$ command [option] [sub-option] [argument]`

## Methods
|Method|Argument|Description|
|---|---|---|
|`.option()`|`<flag>, [alias], [description]`|Option definition|
|`.subOption()`|`<mainFlag>, <subFlag>, description`|Sub option definition|
|`.showOptions()`|-|It returns an options array|
|`.parse()`|`<process.argv>`|Parse the command line|

## Data structures

An object is returned when you call method `.parse(process.argv)`. You need this object for your coding. View [example](#example) for more detail.
```
{
    mainFlag: null,
    subFlags: [],
    argument: null,
    commandLength: 0,
    unknowns: []
}
```

An array is returned when you call method `.showOptions()`. You may want to have the option list for your help function.
```
[   // All options
    {   // Option 1
        flag: '',     // main flag
        alias: '',
        description: '',
        subFlags: [
            {
                flag: '', // sub flag 1
                description: ''
            },
            {
                flag: '', // sub flag n
                description: ''
            }
        ]
    },
    {   // Option n
        ...
    }
]
```

## Using
* Step 1: `const { Command } = require('command-handling')`
* Step 2: `const command = new Command()`
* Step 3: You can use method chaining for `command` object.
    * Option definition: `.option(<flag>, [alias], [description])`
    * Sub option definition: `.subOption(<mainFlag>, <subFlag>, [description])`
* Step 4: `.parse(process.argv)` -> It is in the the end of chaining.
    * You can use also `const result = command.parse(process.argv)`. It returns an object after parsing. You need this object for your coding.
* Extra: Using method `.showOptions()` to get back all options are defined above for your help function.
    * Example: `const options = command.showOptions()`

## Example

```
const { Command } = require('command-handling');
const command = new Command();

command
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View the help information")
    .option("-cf", "--config", "Config for this app")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path")
    .parse(process.argv);

const options = command.showOptions();

console.log(options); // It returns an object array with all options
```

View more examples on [here](https://github.com/nguyenkhois/command-handling).

## Thank you!
Many thanks to [Commander.js](https://github.com/tj/commander.js) for the inspiration.

*(Completed document is comming soon)*
