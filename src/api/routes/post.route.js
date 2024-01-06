const express = require('express')
const router = express.Router()
const { editPost } = require('../controllers/posts/update')
const { publishPosts } = require('../controllers/posts/create')
const { fetchPosts, fetchPostDetails } = require('../controllers/posts/fetch')
const { deletePost } = require('../controllers/posts/delete')
const { saveUpvotes, fetchUpvotes } = require('../controllers/posts/upvote')
const { searchPosts } = require('../controllers/posts/search')
const { verifyToken } = require('../../auth/auth-middleware')
const { calculatePostViews } = require('../controllers/posts/views')

// User Posts POST request
router.post('/post', verifyToken, publishPosts)

router.get('/api/posts', verifyToken, fetchPosts)

router.get('/api/post/:id', verifyToken, fetchPostDetails)

router.post('/api/post/edit/:postid', verifyToken, editPost)

router.delete('/api/post/delete/:postid', verifyToken, deletePost)

//upvote on posts
router.post('/api/post/upvote/:postid', verifyToken, saveUpvotes)

// getting post upvotes
router.get('/api/post/upvote/:postid', fetchUpvotes)

// search
router.get('/api/searchposts/:searchQuery', searchPosts)

//views
router.put('/api/post/:id/views', verifyToken, calculatePostViews)

module.exports = router
