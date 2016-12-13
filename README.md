# VueComponentGenerator
Command line tool for generating VueJS components from a template.
Supports choosing a parent component (from a list), which the script will
manipulate as best as it can to make the new child component usable
right away.

## Installation
Clone and make this script globally callable.
```
yarn install
```
or
```
npm install
```

## Assumptions
This script assumes that...
* you're using single file components
* you're running it from the parent directory of a directory named "components"

## Usage
```
$ cd your-vue-project/src
$ component
```

## Demo
![Demo gif](/demo.gif)
