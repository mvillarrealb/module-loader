"use strict"

module.exports = (sequelize,DataTypes) => {

  const Comments = sequelize.define("comment",{
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    feed_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },{
      schema : "public",
      classMethods : {
        associate : (models) => {
          Comments.belongsTo(models.Feed,{foreignKey: "feed_id",as:"feed"});
        }
      }
  });

  return Comments;
};
