const express = require('express');
const showTimeControllers = require('../controllers/showtimes');

const router = express.Router();

router.route('/cine/:movie_id')
    .get(showTimeControllers.getCineByMovie);

router.route('/nearestcine/:movie_id')
    .post(showTimeControllers.getNearestCine);

module.exports = router;