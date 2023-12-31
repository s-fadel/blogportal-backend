const db = require("../models");
const Post = db.post;
const { authJwt } = require("../middleware");

exports.createPost = [
  authJwt.verifyToken,
  authJwt.isAdmin,
  (req, res) => {
    Post.create({
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


//Endast inloggade användare ska kunna se inlägg
exports.getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deletePost = [
  authJwt.verifyToken,
  authJwt.isAdmin,
  async (req, res) => {
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
  },
];

exports.updatePost = [
  authJwt.verifyToken,
  authJwt.isAdmin,
  async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId);

      if (!post) {
        return res
          .status(404)
          .send({ message: `Kunde inte hitta inlägget med id ${postId}.` });
      }

      post.content = req.body.content;

      await post.save();

      res.send({ message: "Inlägg uppdaterat framgångsrikt!", post });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
];
