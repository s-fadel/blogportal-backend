module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.TEXT,
  },
});
  return Post;
};
