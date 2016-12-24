"use strict"

const expect    = require("chai").expect;
const assert    = require("chai").assert;

describe("Synchronous module loading test",function() {
  const path = require("path");
  const moduleLoader = require("../");
  /**
   * Mock database connection
   * @type {Object}
   */
  const dbConnection = {
    db: "Dummy",
    query: function(sql,done) {
      done(sql);
    }
  };

  describe("When Loading modules",function() {

    it("Should be able to access every module",function(done){
      let models = {};
      moduleLoader.loadModulesSync({
        baseDirectory: path.join(__dirname,"modules","constructor"),
        moduleHolder: models,
        doNotInclude: [
          "sync-load"
        ]
      },(moduleLoaded) => {
        return require(moduleLoaded)(dbConnection);
      });

      expect(models).to.be.an("object");
      expect(models).to.have.property("Category");
      expect(models).to.have.property("Comments");
      expect(models).to.have.property("Feed");

      expect(models).to.have.deep.property('Category.db',dbConnection);
      expect(models).to.have.deep.property('Comments.db',dbConnection);
      expect(models).to.have.deep.property('Feed.db',dbConnection);

      expect(models).to.have.deep.property('Category.findAll');
      expect(models).to.have.deep.property('Comments.findAll');
      expect(models).to.have.deep.property('Feed.findAll');

      done();
    });

    it("Should load modules without constructor and perform all modules operations",function(done){
        let math = {};
        moduleLoader.loadModulesSync({
          baseDirectory: path.join(__dirname,"modules","no_constructor"),
          moduleHolder: math,
          doNotInclude: [
            "sync-load"
          ]
        },(moduleLoaded) => {
          return require(moduleLoaded);
        });
        
        expect(math).to.have.property("division");
        expect(math).to.have.property("substract");
        expect(math).to.have.property("sum");
        expect(math).to.have.property("multiply");

        assert.strictEqual(math.sum(2,2), 4, 'Sum result must be 4');
        assert.strictEqual(math.substract(2,2), 0, 'Substract result must be 0');
        assert.strictEqual(math.multiply(5,8), 40, 'Multiply result should be strict equal to 40');
        assert.strictEqual(math.division(50,2), 25, 'División result should be 25');

        done();
    });
  });


});
