const express = require("express");
const router = express.Router();
const {fetchComments} = require("../controllers/comments/fetch");
const {publishComment} = require("../controllers/comments/create");

const {saveCommentUpvotes, fetchCommentUpvotes} = require("../controllers/comments/upvote")
const {verifyToken} = require("../../auth/auth-middleware");
// posting comments
router.post("/post/comment", verifyToken, publishComment);

// getting comments from the database and providing it to frontend
router.get("/comments", fetchComments);


// upvote on comments
router.post("/api/comment/upvote/:commentid", verifyToken, saveCommentUpvotes);
  
// getting comment upvotes
router.get("/api/comment/upvote/:commentid", fetchCommentUpvotes);

module.exports = router
