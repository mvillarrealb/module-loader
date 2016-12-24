
const db = require("./models")({
  database : "home",
  username : "postgres",
  password :"18911662",
  logging: false,
  host: "localhost",
  dialect: "postgres",
  define: {
    freezeTableName : true
  }
});

db.sequelize.sync({ force: true }).then(()=> {
  return db.Category.create({
    category_name: "Programming"
  });
}).then((category) => {
  return db.Feed.create({
    category_id: category.category_id,
    title: "Creating a module-loader for sequelize",
    feed: "This is a test feed on how to create a module-loader to load modules...",
    author: "Marco Villarreal"
  });

}).then((feed) => {
  return db.Comments.bulkCreate([
    {
      feed_id: feed.feed_id,
      author: "Juan Sin miedo",
      comment: "Nice post"
    },
    {
      feed_id: feed.feed_id,
      author: "Juan Catorce",
      comment: "Didn't understand why sync and not async..."
    },
    {
      feed_id: feed.feed_id,
      author: "Juan X",
      comment: "Would be nice to.."
    },
    {
      feed_id: feed.feed_id,
      author: "Juan Y",
      comment: "Does not work for me :)"
    }
  ]);

}).then((comments)=> {
  console.log(comments);
}).catch((error) => {
  console.error(error);
});
