const db = require("../models");
const Post = db.post;

exports.createPost = (req, res) => {
  if (req.user.role === db.ROLES[1]) {
    Post.create({
      title: req.body.title,
      content: req.body.content,
    })
      .then((post) => {
        res.send({ message: "Post created successfully!", post });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res
      .status(403)
      .send({ message: "Only admin can post" });
  }
};

exports.getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};