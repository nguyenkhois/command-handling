# command-handling
The lightweight Node.js command handling that is using for CLI app. This package is also using for [code-template-generator](https://www.npmjs.com/package/code-template-generator).

You can view [Commander.js](https://github.com/tj/commander.js) if you are thinking about a great Node.js CLI app. This package is using for small app that is not has many complex features.

## Table of contents
* [Syntax](#syntax)
* [Methods](#methods)
* [Data structures](#data-structures)
* [Using](#using)
* [Examples](#examples)
* [Thank you!](#thank-you)

## Syntax
`$ command [option] [sub-option] [argument]`

## Methods
|Method|Argument|Description|
|---|---|---|
|`.option()`|`<flag>, [alias], [description]`|Option definition|
|`.subOption()`|`<mainFlag>, <subFlag>, description`|Sub option definition|
|`.showOptions()`|-|It returns an options array|
|`.parse()`|`<process.argv>`|Parse the command line|

## Data structures

An object is returned when you call method `.parse(process.argv)`. View [examples](#examples) for more detail.
```
{
    mainFlag: null,
    subFlags: [],
    argument: null,
    commandLength: 0,
    unknowns: []
}
```

An array is returned when you call method `.showOptions()`
```
[
    {
        flag: '',     // main flag
        alias: '',
        description: '',
        subFlags: [{
            flag: '', // sub flag
            description: ''
        }]
    },
    {
        ...
    }
]
```

## Using
* Step 1: `const { Command } = require('command-handling')`
* Step 2: `const command = new Command()`
* Step 3: You can use method chaining for `command`
    * Option definition: `.option(<flag>, [alias], [description])`
    * Sub option definition: `.subOption(<mainFlag>, <subFlag>, [description])`
* Step 4: `.parse(process.argv)` -> It is in the the end of chaining.
    * You can use also `const result = command.parse(process.argv)`. It returns an object after parsing. You need this object to your coding.
* Extra: Using method `.showOptions()` to get back all options are defined above when you will coding the help function.
    * Example: `const options = command.showOptions()`
## Examples

__Example 1__
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

__Example 2__
```
const { Command } = require('command-handling');
const command = new Command();

command
    .option("-v", "--version", "View the installed version")
    .option("-help", "--help", "View the help information")
    .option("-cf", "--config", "Config for this app")
    .subOption("-cf", "--set-asset", "Store the asset directory path")
    .subOption("-cf", "--view-asset", "View the asset directory path");

const result = command.parse(process.argv);

const options = command.showOptions();

console.log(result); // It returns an object after parsing

console.log(options); // It returns an object array with all options
```

## Thank you!
Many thanks to [Commander.js](https://github.com/tj/commander.js) for the inspiration.

*(Completed document is comming soon)*
