const moduleLoader = require("../../../");
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
