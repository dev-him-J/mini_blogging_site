// importing the express package for creating server and router
const express = require("express");
//importing authercontroller
const authorController = require("../../controllers/authorController");
//importing blogcontroller
const blogController = require("../../controllers/blogController");
//importing middlewares
const { authentication, authorisation } = require("../../middlewares/auth");
const router = express.Router();
// router.get("/test", function (req, res) {
//   res.send("hello ");
// });
//creating author
router.post("/authors", authorController.createAuthor);
//creating blogs
router.post("/blogs", authentication, blogController.createBlog);
//getting authors
router.get("/authors", authentication, authorController.getAuthors);
//login
router.post("/login", authorController.userLogin);
//getting blogs
router.get("/blogs", authentication, blogController.getBlogs);
//updating blogs
router.put(
  "/blogs/:blogId",
  authentication,
  authorisation,
  blogController.updateBlog
);
//deleting blogs by path params
router.delete(
  "/blogs/:blogId",
  authentication,
  authorisation,
  blogController.deleteByPathParam
);
//deleting blogs by query params
router.delete(
  "/blogs",
  authentication,
  authorisation,
  blogController.deleteByQueryParam
);

module.exports = router;
