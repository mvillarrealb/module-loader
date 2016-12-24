"use strict"

module.exports = (sequelize,DataTypes) => {

  const Category = sequelize.define("category",{
    category_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }

  },{
      schema : "public",
      classMethods : {
        associate : (models) => {
          Category.hasMany(models.Feed,{foreignKey: "category_id",as:"feeds"});
        }
      }
  });

  return Category;
};
