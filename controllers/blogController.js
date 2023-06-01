const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
// POST /blogs
const createBlog = async (req, res) => {
  try {
    const authorId = req.body.authorId;
    const author = await authorModel.findById({ _id: authorId });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    const blog = await blogModel.create(req.body);
    res.status(201).send({ status: true, data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server Error" });
  }
};
// GET /blogs
// GET /blogs
// Returns all blogs in the collection that aren't deleted and are published
// Return the HTTP status 200 if any documents are found. The response structure should be like this
// If no documents are found then return an HTTP status 404 with a response like this
// Filter blogs list by applying filters. Query param can have any combination of below filters.
// By author Id
// By category
// List of blogs that have a specific tag
// List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2 z

const getBlogs = async (req, res) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const blogs = await blogModel.find({
        $and: [{ isDeleted: false }, { isPublished: true }],
      });
      res.status(200).send({ status: true, Blogs: blogs });
    } else {
      const { authorId, category, tag, subcategory } = req.query;

      // const authorId = req.query.authorId;
      // const category = req.query.category;
      // const subcategory = req.query.subcategory;
      // const tag = req.query.tag;

      console.log(authorId);
      console.log(req.query);
      const filters = {};
      if (authorId) {
        filters.authorId = authorId;
      }
      if (category) {
        filters.category = category;
      }
      if (tag) {
        //tags:"Music"
        filters.tags = { $in: tag };
      }
      if (subcategory) {
        filters.subcategory = { $in: subcategory };
      }
      console.log(filters);
      const blogs = await blogModel.find({
        $and: [{ isDleted: false }, { isPublished: true }, filters],
      });
      if (blogs.length > 0) {
        res.status(200).send({ status: true, data: blogs });
      } else {
        res.status(404).json({ message: "No blogs found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server Error" });
  }
};

// PUT /blogs/:blogId
// Updates a blog by changing the its title, body, adding tags, adding a subcategory. (Assuming tag and subcategory received in body is need to be added)
// Updates a blog by changing its publish status i.e. adds publishedAt date and set published to true
// Check if the blogId exists (must have isDeleted false). If it doesn't, return an HTTP status 404 with a response body like this
// Return an HTTP status 200 if updated successfully with a body like this
// Also make sure in the response you return the updated blog document

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, body, tags, subcategory } = req.body;
    const findBlog = await blogModel.find({ _id: blogId, isDeleted: false });
    if (findBlog.length === 0) {
      res.status(404).send({ status: false, message: "Blog Not Found" });
    } else {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { tags: { $each: tags }, subcategory: { $each: subcategory } },
          $set: { title: title, body: body },
        },
        { new: true }
      );
      res.status(200).send({ status: true, Blog: blog });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: error.message });
  }
};

// DELETE /blogs/:blogId
// Check if the blogId exists( and is not deleted). If it does, mark it deleted and return an HTTP status 200 without any response body.
// If the blog document doesn't exist then return an HTTP status of 404 with a body like

const deleteByPathParam = async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const findAllBlogs = await blogModel.find({ _id: blogId });
    if (findAllBlogs.length === 0) {
      res.status(404).json({ message: "Enter the correct blogId" });
    }

    const findBlog = await blogModel.findOne({ _id: blogId, isDeleted: true });
    if (!findBlog) {
      const updateBlog = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { $set: { isDeleted: true, deletedAt: date.now() } }
      );
      res.status(200).send({ status: true, message: "deleted successful" });
    } else {
      res.status(404).send({ status: true, message: "blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

// DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like
const deleteByQueryParam = async (req, res) => {
  try {
    const filters = req.query;
    filters.isDeleted = false;
    const deletedData = await blogModel.updateMany(filters, {
      $set: { isDeleted: true },
    });
    let deletedCount = deletedData.modifiedCount;
    if (deletedCount != 0) {
      return res
        .status(200)
        .send({ status: true, msg: `deleted ${deletedCount} blog` });
    }
    return res
      .status(404)
      .send({ status: false, msg: "no data is found to be deleted" });
  } catch (err) {
    res.status(500).send({ status: false, message: " internal server error" });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  updateBlog,
  deleteByPathParam,
  deleteByQueryParam,
};
