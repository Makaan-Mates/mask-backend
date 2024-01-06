const express = require("express")
const router = express.Router()
const {verifyToken} = require("../../auth/auth-middleware");
const {saveTopic} = require("../controllers/users/topicFollowing")
const {userPostsInfo} = require("../controllers/users/profile")
const {userInfo} = require("../controllers/users/userInfo")
const {userBookMarks,fetchBookMarkedUsers,fetchUserBookmarkedPosts} = require("../controllers/users/bookmarks")
const verifyUser = require("../controllers/users/verifyUser")
const {publishFeedback} = require("../controllers/users/feedback")

router.get("/api/home", verifyToken, userInfo );
router.post("/topics", verifyToken, saveTopic);
router.get("/api/posts/user/:userId", verifyToken, userPostsInfo );
router.post("/api/user/bookmark/:postid", verifyToken,userBookMarks ); 
router.get("/api/post/bookmark/:postid",fetchBookMarkedUsers );
router.get("/api/user/bookmarks",verifyToken,fetchUserBookmarkedPosts );
router.post("/api/verification", verifyToken, verifyUser)
router.post("/api/user/feedback",verifyToken,publishFeedback)

module.exports = router
