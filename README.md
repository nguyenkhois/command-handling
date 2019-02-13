# command-handling
The lightweight Node.js command handling that is using for CLI app. This package is also using for [code-template-generator](https://www.npmjs.com/package/code-template-generator).

You can view [Commander.js](https://github.com/tj/commander.js) if you are thinking about a great Node.js CLI app. This package is using for small app that is not has many complex features.

## Table of contents
* Syntax
* Methods
* Data structures
* Examples
* Thank you!

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

An object is returned when you call method `.parse(process.argv)`. View examples for more detail.
```
{ mainFlag: null,
  subFlags: [],
  argument: null,
  commandLength: 0,
  unknowns: [] }
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

## Examples
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

View `/example.js` file for more details.

## Thank you!
Many thanks to [Commander.js](https://github.com/tj/commander.js) for the inspiration.

*(Completed document is comming soon)*
