const sql = require('../config/db');
const download = require('../helpers/download');
const crawler = require('../helpers/crawler');

module.exports = {
    create: function (req, res) {
        const img_name = req.body.moveek_id;
        download(req.body.image_url, img_name + '.jpg', () => { console.log({ done: true }) });

        const newMovie = {
            name: req.body.name,
            imdb_rating: req.body.imdb_rating,
            image_url: "/images" + img_name + '.jpg',
            trailer_url: req.body.trailer_url,
            main_actors: req.body.main_actors,
            types: req.body.types,
            description: req.body.description,
            duration: req.body.duration,
            moveek_id: req.body.moveek_id
        };
        if (!newMovie.name || !newMovie.imdb_rating || !newMovie.trailer_url ||
            !newMovie.main_actors || !newMovie.types || !newMovie.description ||
            !newMovie.duration || !newMovie.moveek_id) {
            res.send(err);
            return;
        }
        sql.query('INSERT INTO movies SET ?', newMovie, (err, result) => {
            if (err) res.send(err);
            res.json({ done: true });
        })
    },

    getMovieByName: function (req, res) {
        const movieName = '%' + req.params.movie_name + '%';
        sql.query('SELECT * FROM movies WHERE name LIKE ? AND deleted_at IS NULL', movieName, (err, result) => {
            if (err) res.send(err);
            else {
                res.json(result);
            }
        })
    },

    getMovieById: function (req, res) {
        const movie_id = req.params.movie_id;
        sql.query(`SELECT movies.*, r.app_rating FROM movies LEFT JOIN (
            SELECT movie_id, ROUND(AVG(point), 1) AS app_rating FROM rates
            GROUP BY (movie_id)) AS r
            ON movies.movie_id = r.movie_id WHERE movies.movie_id = ?;`,
            movie_id,
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(result[0])
                }
            })
    },

    getAllMovies: function (req, res) {
        sql.query('SELECT * FROM movies WHERE deleted_at IS NULL', (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },

    deleteMovieById: function (req, res) {
        const movie_id = req.params.movie_id;
        sql.query('UPDATE movies SET deleted_at = NOW() WHERE movie_id = ?', movie_id, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'Deleted' })
            }
        })
    },

    updateMovieById: function (req, res) {
        const updateMovie = {
            name: req.body.name,
            imdb_rating: req.body.imdb_rating,
            age_rated: req.body.age_rated,
            trailer_url: req.body.trailer_url,
            main_actors: req.body.main_actors,
            types: req.body.types,
            description: req.body.description,
            duration: req.body.duration
        }
        sql.query('UPDATE movies SET ? WHERE movie_id = ?', [updateMovie, req.params.movie_id], (err, result) => {
            if (err) res.send(err);
            else res.json(result);
        })
    },

    getMovieByType: function (req, res) {
        const type = '%' + req.params.movie_type + '%';
        sql.query('SELECT * FROM movies WHERE types LIKE ? AND deleted_at IS NULL', type, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    },

    crawlMovieInfo: function (req, res) {
        crawler.crawlMovieInfo()
            .then(response => {
                let list_moveek_id = [];
                sql.query('SELECT moveek_id FROM movies WHERE deleted_at IS NULL', (err, result) => {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        list_moveek_id = result.map(item => (item.moveek_id.toString()))
                    }
                    for (let i = 0; i < response.length; i++) {
                        if (list_moveek_id.indexOf(response[i].moveek_id) < 0) {
                            const image_name = response[i].moveek_id;
                            download(response[i].image_url, image_name + '.jpg', () => { });

                            response[i].image_url = '/images/' + image_name + '.jpg';
                            sql.query('INSERT INTO movies SET ?', response[i], (err, result) => {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        }
                    }
                })
            })
            .then(() => res.send({ done: true }))
            .catch(err => { res.send({ error: err }) });
    }
}