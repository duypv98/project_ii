const express = require('express');
const showTimeControllers = require('../controllers/showtimes');

const router = express.Router();

router.route('/showtime')
    .get(showTimeControllers.getAllDisplayingMovie);

router.route('/showtime/:movie_id')
    .get(showTimeControllers.getMovieShowtime)

router.route('/showtime/:movie_id/cinema/:cine_id')
    .get(showTimeControllers.getMovieShowtimeByCine);

module.exports = router;