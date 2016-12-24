module-loader
==============

Lite synchronous and asynchronous module loader to make a dynamic use of
**require** on a specified directory.

## Installation

```shell

  npm install module-loader --save

```

## General

module-loader is a node module that can be used to easyly include your own
code digging directories using native node fs module.

## Usage

module-loader has to basic methods

__loadModulesSync: ({
  baseDirectory = null,
  moduleHolder = null,
  doNotInclude = [],
  namingStrategy = defaultNamingStrategy
},loaderFunction)__

Load modules in a synchronous way, this method receives two params

* options: Options to perform the module loading;
  * baseDirectory(String): Base directory where all the loading will begin
  * moduleHolder(Object): Target Object, this object will receive every require(..) as a property according to the naming strategy
  * doNotInclude(Array): An array of files or paths to be excluded
  * namingStrategy(Function): A function used to name each property in moduleHolder object, the namingStrategy is a function which receives the loaded module full path, and the module itself. Inside this function you will have the freedom to determine which name the module will have over the holder, by default
  the naming strategy will use the file's name, for example Category.js will become Category, however you can implement whatever strategy is suitable by
  your use case.

* loaderFunction: loaderFunction is the function used to involve require(..) calls
you must return a require(module..) with your specific constructors for the module.



__loadModulesSync: ({
  baseDirectory = null,
  moduleHolder = null,
  doNotInclude = [],
  namingStrategy = defaultNamingStrategy
},loaderFunction,loadDone)__

Load modules in a asynchronous way, this method receives three params

* options: Options to perform the module loading;
  * baseDirectory(String): Base directory where all the loading will begin require(..) as a property according to the naming strategy
  * doNotInclude(Array): An array of files or paths to be excluded
  * namingStrategy(Function): A function used to name each property in moduleHolder object, the namingStrategy is a function which receives the loaded module full path, and the module itself. Inside this function you will have the freedom to determine which name the module will have over the holder, by default
  the naming strategy will use the file's name, for example Category.js will become Category, however you can implement whatever strategy is suitable by
  your use case.

* loaderFunction: loaderFunction is the function used to involve require(..) calls
you must return a require(module..) with your specific constructors for the module.  

* loadDone: Callback function which marks the loading process as done, it will receive as a parameter the object holder, in this case the holder is provided by the function itself.

## Use cases

You can ask yourself, why would I need a f**ng module loader? here are some useful
use cases

### Sequelize's ORM boilerplate index
The main create this module was to reduce the boilerplate used to load sequelize's
ORM models into a single db property, the example is as follows:

```javascript
"use strict"

module.exports = function() {
  const moduleLoader = require("module-loader");
  const Sequelize = require("sequelize");
  const sequelize = new Sequelize(...);

  const path = require("path");

  let db = {};

  moduleLoader.loadModulesSync({
    baseDirectory: path.join(__dirname),//Path to start lstat(current directory)
    moduleHolder: db,//Holder which will receive require(..)
    doNotInclude: [ //array of directories, or files to exclude
      "index.js"//exclude self to avoid maximum stack call exceed :)
    ]
  },(moduleLoaded) => {
    //According to sequelize's page you have define your modules as self
    //contained functions which receive sequelize connection and base sequelize as //parameter
    return require(moduleLoaded)(sequelize,Sequelize);
  });

  Object.keys(db).forEach((modelName) => {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
}

```

### Express's middleware grouping

When developing express's applications is almost an imperative requirement to develop middlewares, those fancy functions which executes before, or after your http call. In some cases express applications may have a lot of middleware to be used so may come in handy to have every middleware available.

```javascript

const moduleLoader = require("module-loader");
const path = require("path");

let middleware = {};

moduleLoader.loadModulesSync({
  baseDirectory: path.join(__dirname),//Path to start lstat(current directory)
  moduleHolder: middleware,//Holder which will receive require(..)
  doNotInclude: [ //array of directories, or files to exclude
    "index.js"//exclude self to avoid maximum stack call exceed :)
  ]
},(moduleLoaded) => {
  return require(moduleLoaded)();
});

module.exports =  middleware;
.
.
//in your further script you can use the middleware by just requiring the directory's index
const middleware = require("./middleware");

console.log(middleware);//this object will hold all your middleware

```

### Everything wich requires to collect a group of modules into a "holder"

If you found yourself in the need to use an object which collects modules from
a directory, then module-loader may be suitable for your needs, it does not require any additional node modules and uses native node's fs module

## Tests

```shell
  npm test
```
