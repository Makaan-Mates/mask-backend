const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const secretKeyForAuthentication = "Mask@_#1045718";
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user.model");
const Post = require("./models/post.model");

app.use(cors());
app.use(express.json());
// Connecting to mongodb...
mongoose.connect(
  "mongodb+srv://rathoursourabh45:Mask%40%5F%231045718@cluster0.px2olez.mongodb.net/users"
);

// Copied from stack overflow - checking the connection to the database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("once", (error, response) => {
  console.log(response);
});

// Token Verification
const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders && authHeaders.split(" ")[1];

  if (token === null)
    return res.status(401).json({ message: "token not found" });

  jwt.verify(token, secretKeyForAuthentication, (err, decoded) => {
    if (err) {
      res.status(401).json({
        message: "invalid token",
      });
      return;
    } else {
      req.user = decoded;
      next();
    }
  });
};

app.get("/api/home", verifyToken, (req, res) => {
  //   console.log(req.user);
  res.json({
    key: "hello",
  });
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  const newUser = await User({
    email: email,
    username: username,
    password: password,
  });

  const savedUser = await newUser.save();

  const token = jwt.sign({email:savedUser.email},secretKeyForAuthentication);

  res.status(201).json({
    token:token,
    message: "account created!",
  });   
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });

  if (user === null) {
    res.status(404).json({ message: "account not found" });
    return;
  }

  try {
    if ((await user.password) === password) {
      const token = jwt.sign({ email: email }, secretKeyForAuthentication);
      res.status(200).json({
        token: token,
        message: "logged in",
      });
    } else {
      res.status(401).json({ message: "wrong password bro" });
    }
  } catch {
    res.status(500).send();
  }
});

// User Posts POST request
app.post("/post", verifyToken, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const { topic, title, description } = req.body;
  const newPost = await Post({
    topic: topic,
    title: title,
    description: description,
    user_id: user._id
    
  });

  const savedPost = await newPost.save();
  res.json({
    message: savedPost,
  });
});

// User Posts GET requests
app.get("/api/posts", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({
      posts: posts,
    });
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(4000, () => {
  console.log("server started...");
});
