"use strict"

module.exports = (sequelize,DataTypes) => {

  const Feed = sequelize.define("feed",{
    feed_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    feed: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    author: {
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
          Feed.belongsTo(models.Category,{foreignKey: "category_id",as:"category"});
          Feed.hasMany(models.Comments,{foreignKey: "feed_id", as: "comments"})
        }
      }
  });

  return Feed;
};
