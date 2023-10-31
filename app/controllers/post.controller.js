const db = require("../models");
const Post = db.post;

exports.createPost = (req, res) => {
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
};

exports.getAllPosts = (req, res) => {
  Post.findAll()
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });

   /*  exports.deletePost = (req, res) => {
      const postId = req.params.id;

      Post.destroy({
        where: { id: postId },
      })
        .then((num) => {
          if (num === 1) {
            res.send({ message: "Inlägg raderat framgångsrikt!" });
          } else {
            res
              .status(404)
              .send({ message: `Kunde inte hitta inlägget med id ${postId}.` });
          }
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    }; */
};
