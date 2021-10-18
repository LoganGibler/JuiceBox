const express = require("express");
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");
  next();
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const tagName = await req.params;
  try {
    const getPosts = await getPostsByTagName(tagName);
    console.log("this is getPosts", getPosts);
    const posts = getPosts.filter((post) => {
      if (post.active) {
        return true;
      }
      if (req.user && post.author.id === req.user.id) {
        return true;
      }
      return false;
    });

    res.send({
      posts,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

tagsRouter.get("/", async (req, res, next) => {
  const tags = await getAllTags();
  res.send({
    tags,
  });
});

module.exports = tagsRouter;
