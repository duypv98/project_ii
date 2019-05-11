import express from 'express';
import showTimeController from '';

const router = express.Router();
router.route('/cine/:movie_id')
    .get(showTimeController.getCineByMovie);

router.route('/nearest-cine/:movie_id')
    .post(showTimeController.getNearestCine);

module.exports = router;