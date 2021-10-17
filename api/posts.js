const express = require('express');
const { getAllPosts } = require('../db');
const postsRouter = express.Router();

postsRouter.use( async (req, res, next) => {
  console.log("A request is being made to /posts");
  const posts = await getAllPosts()
  console.log(posts)
  res.send({
    "posts" : posts.rows
  });
  next()
});

module.exports = postsRouter;