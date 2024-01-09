const express = require("express")
const router = express.Router()
const {verifyToken} = require("../../auth/auth-middleware");
const {saveTopic} = require("../controllers/users/topicFollowing")
const {userPostsInfo,editProfile} = require("../controllers/users/profile")
const {userInfo} = require("../controllers/users/userInfo")
const {userBookMarks,fetchBookMarkedUsers,fetchUserBookmarkedPosts} = require("../controllers/users/bookmarks")
const verifyUser = require("../controllers/users/verifyUser")
const {publishFeedback} = require("../controllers/users/feedback")
const {fetchUserNotications,clearNotifications} = require("../controllers/users/notification")


router.get("/api/home", verifyToken, userInfo );
router.post("/topics", verifyToken, saveTopic);
router.get("/api/posts/user/:userId", verifyToken, userPostsInfo );
router.post("/api/profile/edit/:userId",verifyToken,editProfile)
router.post("/api/user/bookmark/:postid", verifyToken,userBookMarks ); 
router.get("/api/post/bookmark/:postid",fetchBookMarkedUsers );
router.get("/api/user/bookmarks",verifyToken,fetchUserBookmarkedPosts );
router.post("/api/verification", verifyToken, verifyUser)
router.post("/api/user/feedback",verifyToken,publishFeedback)
router.get("/api/notification",verifyToken,fetchUserNotications)
router.delete("/api/notification/clear",verifyToken,clearNotifications)

module.exports = router
