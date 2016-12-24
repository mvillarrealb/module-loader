"use strict"

module.exports = function(dbConf) {
  const moduleLoader = require("../../../");
  const Sequelize = require("sequelize");
  const sequelize = new Sequelize(dbConf.database,dbConf.username,dbConf.password,dbConf);
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
