const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  getAllPosts,
  getUserById,
  getPostsByUser,
  updatePost,
  createPost,
  getAllTags,
  getUserByUsername,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS tags;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name varchar(255) NOT NULL,
        location varchar(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts(
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE tags(
        id SERIAL PRIMARY KEY, 
        name varchar(255) UNIQUE NOT NULL
      );
`);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({
      username: "albert",
      password: "bertie99",
      name: "Robert",
      location: "Milton",
    });
    await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Shaun",
      location: "Ohio",
    });
    await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Legolas",
      location: "Pensacola",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    throw error;
  }
}

async function createInitialPosts() {
  try {
    console.log("Creating initial posts!");
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "albert Post",
      content:
        "This is my albert post. I hope I love writing blogs as much as I love reading them.",
    });
    await createPost({
      authorId: sandra.id,
      title: "sandra Post",
      content:
        "This is my sandra post. I hope I love writing blogs as much as I love reading them.",
    });
    await createPost({
      authorId: glamgal.id,
      title: "glamgal Post",
      content:
        "This is my glamgal post. I hope I love writing blogs as much as I love reading them.",
    });

    console.log("Finished creating initial posts!");
  } catch (error) {
    console.error("Error creating Posts!");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");


    console.log("Calling getAllTags")
    const tags = await getAllTags()
    console.log("Result:", tags)


    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("WHAT IS USERS?", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log(" 136 Result:", posts);

    console.log("Calling updatePost on posts[0]");
    // console.log("what is posts?", posts);
    // console.log("what is posts.rows?", posts.rows);
    // console.log("what is posts.rows at [0].id?", posts.rows[0].id);

    const updatePostResult = await updatePost(posts.rows[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("updatePosts works!");

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
