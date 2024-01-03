const express = require("express")
const router = express.Router()
const {verifyToken} = require("../../auth/auth-middleware");
const {saveTopic} = require("../controllers/users/topicFollowing")
const {userPostsInfo} = require("../controllers/users/profile")
const {userInfo} = require("../controllers/users/userInfo")

router.get("/api/home", verifyToken, userInfo );
router.post("/topics", verifyToken, saveTopic);
router.get("/api/posts/user/:userId", verifyToken, userPostsInfo );

module.exports = router
