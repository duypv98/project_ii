import sql from '../config/db';
import download from '../helpers/download';

module.exports = {
    create: function (req, res) {
        const img_name = req.body.moveek_id;
        download(req.body.image_url, img_name + '.jpg', () => {
            console.log({ done: true });
        })

        const newMovie = {
            name: req.body.name,
            imdb_rating: req.body.imdb_rating,
            image_url: "/images/" + img_name + '.jpg',
            trailer_url: req.body.trailer_url,
            main_actors: req.body.main_actors,
            types: req.body.types,
            description: req.body.description,
            moveek_id: req.body.moveek_id,
            duration: req.body.duration
        }

        if (!newMovie.name || !newMovie.imdb_rating || !newMovie.trailer_url || !newMovie.main_actors ||
            !newMovie.types || !newMovie.description || !newMovie.moveek_id || !newMovie.duration) {
            res.send("Empty fields");
            return;
        }
        sql.query('INSERT INTO movies SET ?', newMovie, (err, result) => {
            if (err)
                res.send(err);
            res.json({ done: true, result: result });
        })
    },

    getMovieByName: function (req, res) {
        const movieName = '%' + req.params.movie_name + '%';
        sql.query('SELECT * FROM movies WHERE name LIKE ? AND deleted_at IS NULL', movieName, (err, result) => {
            if (err)
                res.send(err);
            else {
                res.json(result);
            }
        })
    },

    getMovieById: function (req, res) {
        const movie_id = req.params.movie_id;
        sql.query(
            `SELECT movies.*, r.gmdb_rating FROM movies
            LEFT JOIN (SELECT movie_id, ROUND(AVG(point), 1) as gmdb_rating FROM rates 
            GROUP BY (movie_id)) as r
            ON movies.movie_id = r.movie_id 
            WHERE movies.movie_id = ?;`,
            movie_id,
            (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.json(result[0]);
                }
            }
        )
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
                res.json({ message: "Successfully deleted" })
            }
        })
    }
}