"use strict";

module.exports = (dbConnection) => {
  return {
    name : "Feed",
    findAll: (done) => {
      dbConnection.query([
        {categoryId: 1,name :"Foo",description: "Bar"}

      ],function(results){
        console.log(results);
      })
    },
    db:  dbConnection
  };
};
