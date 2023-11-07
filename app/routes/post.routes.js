const { authJwt } = require("../middleware");
const postController = require("../controllers/post.controller");

module.exports = function (app) {
  app.post(
    "/api/createPost",
    [authJwt.verifyToken, authJwt.isAdmin],
    postController.createPost
  );

  app.get(
    "/api/getAll",
    [authJwt.verifyToken, authJwt.isAdmin],
    postController.getAllPosts
  );

  // Hämta alla inlägg (publik åtkomst)
  app.get("/api/posts", postController.getAllPosts);

  app.put(
    "/api/updatePost/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    postController.updatePost
  );

  app.delete(
    "/api/deletePost/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    postController.deletePost
  );
};
