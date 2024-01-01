const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const secretKeyForAuthentication = "Mask@_#1045718";
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user.model");
const Post = require("./models/post.model");
const Comment = require("./models/comment.model");
const ObjectId = mongoose.Types.ObjectId;

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

app.get("/api/home", verifyToken, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  res.json(user);
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

  const token = jwt.sign(
    { email: savedUser.email },
    secretKeyForAuthentication
  );

  res.status(201).json({
    token: token,
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
    user_id: user._id,
  });

  const savedPost = await newPost.save();
  res.json({
    message: savedPost,
  });
});

app.get("/api/posts", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const topicName = req.query.topic;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let posts;
    let totalCount;

    if (topicName === "home") {
      posts = await Post.find()
        .populate("user_id")
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .exec();

      totalCount = await Post.countDocuments();
    } else {
      posts = await Post.find({
        topic: new RegExp("^" + topicName + "$", "i"),
      })
        .populate("user_id")
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .exec();

      totalCount = await Post.countDocuments({
        topic: new RegExp("^" + topicName + "$", "i"),
      });
    }

    const results = {};

    if (endIndex < totalCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    if (posts.length === 0) {
      return res.json({ message: "No posts found for the specified topic" });
    }

    results.posts = posts;
    res.json(results);
  } catch {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.get("/api/post/:id", verifyToken, async (req, res) => {
  const postId = req.params.id;
  if (!ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid post ID format" });
  }

  try {
    const postDetails = await Post.findOne({ _id: postId })
      .populate("user_id") // Populate the user details based on the user_id reference
      .exec();

    if (!postDetails) {
      res.status(404).json({
        message: "Post not found!",
      });
    }

    res.json({
      postDetails,
    });
  } catch (error) {
    console.log(error);
    //res.status(500).json({ message: "Internal server error" });
  }
});

// posting comments
app.post("/post/comment", verifyToken, async (req, res) => {
  try {
    const commentBody = req.body.content;
    const postid = req.body.postid;
    const email = req.user.email;
    const isReplySection = req.query.isReplySection;
    const parentId = req.body.commentId;
    const user = await User.findOne({ email: email });

    const newComment = await Comment({
      content: commentBody,
      user_id: user._id,
      post_id: postid,
    });

    const savedComment = await newComment.save();

    if (isReplySection === "true") {
      const updatedComment = await Comment.updateOne(
        { _id: savedComment._id },
        { $set: { parentId: parentId } }
      );

      if (updatedComment.nModified === 0) {
        return res.status(500).json({ message: "Failed to update parentId" });
      }
    }

    res.json({
      message: savedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// getting comments from the database and providing it to frontend
app.get("/comments", async (req, res) => {
  try {
    const allComments = await Comment.find()
      .populate("user_id")
      .populate("post_id")
      .exec();

    res.json(allComments);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Saving topics followinng by a user in the database.
app.post("/topics", verifyToken, async (req, res) => {
  try {
    const topicsFollowing = req.body.selectedTopics;
    const user = await User.findOne({ email: req.user.email });
    const updatedUser = await User.updateOne(
      { _id: user._id },
      { $set: { topicsFollowing: topicsFollowing } }
    );

    if (updatedUser.nModified === 0) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    res.json({
      message: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
});

app.delete("/api/post/delete/:postid", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const postid = req.params.postid;
    const postDetails = await Post.findOne({ _id: postid });

    // Delete only if the user is the author of the post
    if (postDetails.user_id.toString() === user._id.toString()) {
      const condition = { _id: postid };
      await Post.deleteOne(condition);
    }

    res.json({
      message: "Post Deleted",
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/posts/user/:userId", verifyToken, async (req, res) => {
  try {
    const userPosts = await Post.find({ user_id: req.params.userId })
      .populate("user_id")
      .exec();

    res.json(userPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

//upvote on posts

app.post("/api/post/upvote/:postid", verifyToken, async (req, res) => {
  try {
    const postid = req.params.postid;
    const postDetails = await Post.findOne({ _id: postid });
    const userDetails = await User.findOne({ email: req.user.email });
    const userId = userDetails._id.toString();

    if (postDetails.upvotes.includes(userId)) {
      const index = postDetails.upvotes.indexOf(userId);
      postDetails.upvotes.splice(index, 1);
      await postDetails.save();
      res.status(200).json({ message: "Upvote Removed", postDetails });
    } else {
      postDetails.upvotes.push(userId);
      await postDetails.save();
      res.json({
        message: "Upvoted",
        postDetails,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// getting post upvotes
app.get("/api/post/upvote/:postid", async (req, res) => {
  try {
    const postid = req.params.postid;
    const postDetails = await Post.findOne({ _id: postid });
    res.json({
      upvotes: postDetails.upvotes,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/searchposts/:searchQuery", async (req, res) => {
  try {
    const searchQuery = new RegExp(`${req.params.searchQuery}`, "i" ) ;
    const searchResults = await Post.find({
      $or: [
        { title: searchQuery  },
        { description: searchQuery },
      ]
    })
      .populate("user_id")
      .exec();

    res.json({
      message: searchResults,
    });
  } catch (error) {
    console.log(error);
  }
})


// upvote on comments
app.post("/api/comment/upvote/:commentid", verifyToken, async (req, res) => {
  try {
    const commentid = req.params.commentid;
    const commentDetails = await Comment.findOne({ _id: commentid });
    const userDetails = await User.findOne({ email: req.user.email });
    const userId = userDetails._id.toString();

    if (commentDetails.upvotes.includes(userId)) {
      const index = commentDetails.upvotes.indexOf(userId);
      commentDetails.upvotes.splice(index, 1);
      await commentDetails.save();
      res.status(200).json({ message: "Upvote Removed", commentDetails });
    } else {
      commentDetails.upvotes.push(userId);
      await commentDetails.save();
      res.json({
        message: "Comment Upvoted",
        commentDetails,
      });
    }
  } catch (error) {
    console.log('Error details:', error)
    res.json({
        message:"server error"
    })
  }
});


// getting comment upvotes
app.get("/api/comment/upvote/:commentid", async (req, res) => {
    try {
      const commentid = req.params.commentid;
      const commentDetails = await Comment.findOne({ _id: commentid });
      res.json({
        upvotes: commentDetails.upvotes,
      });
    } catch (error) {
      console.log(error);
    }
  });

app.listen(4000, () => {
  console.log("server started...");
});
