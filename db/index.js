const { Client } = require("pg"); // imports the pg module

const client = new Client("postgres://postgres@localhost:5432/juicebox-dev");

async function createUser({ username, password, name, location }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, name, location) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, password, name, location]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, 
    username, name, location, active FROM users
  `
  );

  return rows;
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content, tags }) {
  try {
    const {
      rows: [post],
    } = await client.query(
      `
        INSERT INTO posts("authorId", title, content)
        VALUES($1, $2, $3)
        RETURNING *;
      `,
      [authorId, title, content]
    );
    // const tagList = await createTags(tags);
    // return getTagToPost(post.id, tagList);
    return post;
  } catch (error) {
    throw error;
  }
}



// async function getTagToPost(postId, tagList) {
//   try {
//     const tag = tagList.map((tag) => createPostTag(postId, tag.id));

//     await Promise.all(tag);

//     return await getPostById(postId);
//   } catch (error) {
//     throw error;
//   }
// }

async function updatePost(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [post],
    } = await client.query(
      `
      UPDATE posts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return post;
  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try {
    const rows = await client.query(
      `SELECT * FROM posts;`
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllTags() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM tags;
    `);
    console.log("this is tags", rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${userId};
    `);
    // console.log("this is userId", userId);
    // console.log("this is rows", rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT id, username, name, location, active FROM users
    WHERE id=${userId};
    `);

    if (!user) {
      return null;
    }
    // delete user.password;
    user.posts = await getPostsByUser(userId);
    console.log("this is user.posts", user);
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  createUser,
  getAllUsers,
  updateUser,
  getAllPosts,
  getUserById,
  getPostsByUser,
  updatePost,
  createPost,
  getAllTags,
  // getTagToPost,
};
