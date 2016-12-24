"use strict";

const fs = require("fs");
const path = require("path");
/**
 * @method defaultNamingStrategy
 * @param  {String} baseDirectory [description]
 * @param  {Object} loadedModule  [description]
 * @return {String}               [description]
 */
const defaultNamingStrategy = function(baseDirectory,loadedModule) {
  let moduleName = path.basename(baseDirectory,".js");
  return moduleName;
};

const ModuleLoader = {
  _merge: function(sourceObject,targetObject) {
    for(let property in sourceObject){
      targetObject[property] = sourceObject[property]
    }
    return targetObject
  },

  loadModules: function({
    baseDirectory = null,
    doNotInclude = [],
    namingStrategy = defaultNamingStrategy
  },loaderFunction,loadReady) {
    let objectHolder = {};
    fs.readdir(baseDirectory, (err, list) => {
      if (err) return loadReady(err);
      let pending = list.length;
      if (!pending) return loadReady(null, results);
      list.forEach((file) => {
        file = path.resolve(baseDirectory, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            ModuleLoader.loadModules({
              baseDirectory : file,
              doNotInclude : doNotInclude,
              namingStrategy : namingStrategy
            },loaderFunction, function(err, res) {
              objectHolder = ModuleLoader._merge(res,objectHolder);
              if (!--pending){
                loadReady(null, objectHolder);
              }
            });
          } else {
            for(let y = 0; y < doNotInclude.length;y++){
               let excludePattern = doNotInclude[y];
               if (!file.match(excludePattern)){
                 let loadedModule = loaderFunction(file);
                 let moduleName   = namingStrategy(file,loadedModule);
                 objectHolder[moduleName] = loadedModule;
               }
            }
            if (!--pending) {
              loadReady(null, objectHolder);
            }
          }
        });
      });
    });
  },
  /**
   *
   *
   *
   * @method loadModulesSync
   * @param  {String}   options.baseDirectory [description]
   * @param  {Object}   options.moduleHolder [description]
   * @param  {Array}    options.doNotInclude [description]
   * @param  {Function} options.namingStrategy [description]
   * @param  {Function} loaderFunction [description]
   *
   */
  loadModulesSync: function({
    baseDirectory = null,
    moduleHolder = null,
    doNotInclude = [],
    namingStrategy = defaultNamingStrategy
  },loaderFunction) {
     let stat = fs.lstatSync(baseDirectory);
     if ( stat.isDirectory() ) {
      let files = fs.readdirSync(baseDirectory);
      let fileListLen = files.length;

      for (let i = 0; i < fileListLen; i++) {
        let fileToLoad = path.join(baseDirectory, files[i]);
        ModuleLoader.loadModulesSync({
          baseDirectory: fileToLoad,
          moduleHolder: moduleHolder,
          doNotInclude: doNotInclude,
          namingStrategy: namingStrategy
        },loaderFunction);
      }

    } else {
      for(let y = 0; y < doNotInclude.length;y++){
        let excludePattern = doNotInclude[y];
        if (!baseDirectory.match(excludePattern)){
          let loadedModule = loaderFunction(baseDirectory)
          let moduleName   = namingStrategy(baseDirectory,loadedModule);
              moduleHolder[moduleName] = loadedModule;
        }
      }
    }
  }
}

module.exports = ModuleLoader;
