const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

// Author APIs /authors
const createAuthor = async (req, res) => {
  try {
    const Authordata = req.body;
    const author = await authorModel.create(Authordata);
    res.status(201).send({ status: true, data: author });
  } catch (e) {
    console.error(e);
    res
      .status(400)
      .send({ status: false, message: "Please Fill the correct details" });
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await authorModel.find();
    res.status(200).send({ status: true, data: authors });
  } catch (e) {
    console.error(e);
    res
      .status(400)
      .send({ status: false, message: "Please Fill the correct details" });
  }
};
// User Login
const userLogin = async function (req, res) {
  try {
    const validateData = await authorModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    // if credetials are incorrect
    if (!validateData) {
      return res
        .status(400)
        .send({ status: false, msg: "incorrect userName or password" });
    }

    const secretKey = "this-is-our-blogging-site-mini-project";
    // generating  jwt token
    const token = jwt.sign(
      {
        authorId: validateData._id.toString(),
        authorName: validateData.fname,
      },
      secretKey
    );
    //sending token to response header
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: true, data: token });
  } catch (error) {
    res.status(500).send({ status: false, message: error });
  }
};

module.exports = { createAuthor, getAuthors, userLogin };
