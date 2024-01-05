const express = require("express")
const router = express.Router()
const {verifyToken} = require("../../auth/auth-middleware");
const {saveTopic} = require("../controllers/users/topicFollowing")
const {userPostsInfo} = require("../controllers/users/profile")
const {userInfo} = require("../controllers/users/userInfo")
const {userBookMarks,fetchBookMarkedUsers} = require("../controllers/users/bookmarks")
const verifyUser = require("../controllers/users/verifyUser")

router.get("/api/home", verifyToken, userInfo );
router.post("/topics", verifyToken, saveTopic);
router.get("/api/posts/user/:userId", verifyToken, userPostsInfo );
router.post("/api/user/bookmark/:postid", verifyToken,userBookMarks ); 
router.get("/api/post/bookmark/:postid",fetchBookMarkedUsers );
router.post("/api/verification", verifyToken, verifyUser)

module.exports = router
