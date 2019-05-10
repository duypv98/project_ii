import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

/*RESTful API Routes*/

/*404 Error*/
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running on port ${PORT}`);
})