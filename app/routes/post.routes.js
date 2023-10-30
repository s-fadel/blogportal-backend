const { authJwt } = require("../middleware");
const postController = require("../controllers/post.controller");

module.exports = function (app) {
  // Skapa en ny inlägg (endast åtkomst för inloggade användare)
  app.post("/api/posts", [authJwt.verifyToken], postController.createPost);

  // Hämta alla inlägg (publik åtkomst)
  app.get("/api/posts", postController.getAllPosts);

  app.put(
    "/api/editPost/:postId",
    [authJwt.verifyToken, authJwt.isAdmin],
    postController.editPost
  );

  app.delete(
    "/api/deletePost/:postId",
    [authJwt.verifyToken, authJwt.isAdmin],
    postController.deletePost
  );
};