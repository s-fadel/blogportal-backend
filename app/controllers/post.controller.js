const db = require("../models");
const Post = db.post;
const { authJwt } = require("../middleware");

exports.createPost = [
  authJwt.verifyToken,
  authJwt.isAdmin,
  (req, res) => {
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
  },
];

exports.getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const num = await Post.destroy({
      where: { id: postId },
    });

    if (String(num) === String(1)) {
      res.send({ message: "Inlägg raderat framgångsrikt!" });
    } else {
      res
        .status(404)
        .send({ message: `Kunde inte hitta inlägget med id ${postId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return res
        .status(404)
        .send({ message: `Kunde inte hitta inlägget med id ${postId}.` });
    }
    post.title = req.body.title;
    post.content = req.body.content;

    await post.save();

    res.send({ message: "Inlägg uppdaterat framgångsrikt!", post });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
