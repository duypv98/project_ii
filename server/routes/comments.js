const express = require('express');
const commentControllers = require('../controllers/comments');
const verifyToken = require('../config/verifyToken');

const router = express.Router();

router.route('/movies/:movie_id/comments')
    .post(commentControllers.create)
    .get(commentControllers.getAllComments)

router.route('/movies/:movie_id/comments/:rate_id')
    .get(commentControllers.getCommentById)
    .delete(commentControllers.deleteCommentById)

module.exports = router;