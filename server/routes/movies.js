const express = require('express');
const movieControllers = require('../controllers/movies');
const verifyToken = require('../config/verifyToken');

const router = express.Router()

router.route('/movies')
    .get(movieControllers.getAllMovies)
    .post(movieControllers.create);

router.route('/movies/id/:movie_id')
    .get(movieControllers.getMovieById)
    .delete(movieControllers.deleteMovieById)
    .put(movieControllers.updateMovieById)

router.route('/movies/name/:movie_name')
    .get(movieControllers.getMovieByName)

router.route('/movies/type/:movie_type')
    .get(movieControllers.getMovieByType)

router.route('/movies/crawl')
    .get(movieControllers.crawlMovieInfo)

module.exports = router;