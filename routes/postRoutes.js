const express = require('express')
const protect = require('../middleware/authMiddleware.')

const postController = require('../controllers/postController')

const router = express.Router()

router.route("/")
.get(protect, postController.getAllPosts)
.post(protect, postController.createPosts)

router.route("/:id")
.get(protect, postController.getOnePost)
.patch(protect, postController.updatePost)
.delete(protect, postController.deletePost)

module.exports = router;