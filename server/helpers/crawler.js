const https = require('superagent');
const DomParser = require('dom-parser');
const jsdom = require('jsdom');

const parser = new DomParser();
const { JSDOM } = jsdom;
const locationHanoi = 'location=YTo0OntzOjk6ImZhdm91cml0ZSI7YjowO3M6NDoidHlwZSI7czo2OiJyZWdpb24iO3M6NjoicmVnaW9uIjthOjM6e3M6MjoiaWQiO2k6OTtzOjQ6Im5hbWUiO3M6OToiSMOgIE7hu5lpIjtzOjQ6InNsdWciO3M6NjoiaGEtbm9pIjt9czo4OiJsb2NhdGlvbiI7YToyOntzOjM6ImxhdCI7czowOiIiO3M6MzoibG5nIjtzOjA6IiI7fX0%3D; path=/; domain=.moveek.com; Expires=Tue, 19 Jan 2038 03:14:07 GMT;'

class Crawler {
    async crawlCineIdAndMovieIdFromMoveek(moveek_id, date) {
        const res = await https.get('https://moveek.com/showtime/movie/' +
            moveek_id +
            '?date=' + date +
            '&version=')
            .set('Cookie', locationHanoi);

        let list_crawl = [];
        let list_crawl_group = [];
        const { cineplexes } = res.body;

        for (let i = 0; i < cineplexes.length; i++) {
            for (let j = 0; j < cineplexes[i].cinemas.length; j++) {
                await this.crawlMovieShowtimeFromCine(moveek_id, cineplexes[i].cinemas[j].id, date)
                    .then((res2) => {
                        list_crawl_group.push({
                            cine_id: cineplexes[i].cinemas[j].id,
                            cine_name: cineplexes[i].cinemas[j].name,
                            showtime: res2
                        });
                    })
            }
            list_crawl.push({
                cine_group_id: cineplexes[i].data.id,
                cine_group_name: cineplexes[i].data.name,
                list_crawl_group: list_crawl_group
            });
            list_crawl_group = [];
        }
        return list_crawl;
    };

    async crawlMovieShowtimeFromCine(moveek_id, cine_id, date) {
        const res = await https.get('https://moveek.com/showtime/movie/' +
            moveek_id +
            '?cinema=' + cine_id +
            '&date=' + date +
            '&version=')
            .set('Cookie', locationHanoi)
            .catch(err => {
                console.log(err)
            });

        const aTags = parser.parseFromString(res.text, 'text/html').getElementsByTagName('a');

        let data = [];

        for (let k = 0; k < aTags.length; k++) {
            const element = aTags[k];
            data.push(element.getElementsByTagName('span')[0].textContent);
        }
        return data;
    };

    async crawlCineFromMovie(moveek_id, date) {
        const res = await https.get('https://moveek.com/showtime/movie/' +
            moveek_id +
            '?date=' + date +
            "&version=")
            .set('Cookie', locationHanoi);

        let cine_list = [];
        const { cineplexes } = res.body;

        for (let i = 0; i < cineplexes.length; i++) {
            for (let j = 0; j < cineplexes[i].cinemas.length; j++) {
                cine_list.push({
                    id: cineplexes[i].cinemas[j].id,
                    name: cineplexes[i].cinemas[j].name,
                    latitude: cineplexes[i].cinemas[j].location.latitude,
                    longitude: cineplexes[i].cinemas[j].location.longitude
                })
            }
        }
        return cine_list;
    }

    async crawlMoveekId() {
        const res = await https.get('https://moveek.com/lich-chieu/');
        const ele = parser.parseFromString(res.text, 'text/html');
        const dom = new JSDOM(ele.rawHTML);
        const allMovies = dom.window.querySelector('.showtimes');
        const movieArray = [].slice.call(allMovies.children);
        const movie_list = [];

        for (let i = 3; i < movieArray.length; i++) {
            const movieData = movieArray[i].querySelector('.card.card-sm.mb-3');
            const moveek_id = movieData.getAttribute('data-movie-id');

            movie_list.push({
                moveek_id: moveek_id
            })
        }

        return movie_list;
    }

    async crawlImageURL() {
        const res = await https.get('https://moveek.com/dang-chieu/');
        const ele = parser.parseFromString(res.text, 'text/html');
        const dom = new JSDOM(ele.rawHTML);
        const allMovies = dom.window.document.querySelector('.row.grid');
        const movieArray = [].slice.call(allMovies.children);
        const list = [];

        movieArray.forEach((movie) => {
            const link = movie.querySelector('a');
            const urlTail = link.getAttribute('href');
            const name = link.getAttribute('title');
            const urlImg = link.querySelector('img').getAttribute('data-secret').split(' ')[2];

            list.push({
                name,
                urlTail,
                urlImg
            })
        });
        return list;
    }

    async crawlMovieInfo() {
        const movie_list = await this.crawlImageURL();
        let list = [];

        for (const movie of movie_list) {
            const res = await https.get(`https://moveek.com${movie.urlTail}`);
            const ele = parser.parseFromString(res.text, 'text/html');
            const dom = new JSDOM(ele.rawHTML);
            const { document } = dom.window;

            const moveek_id = document.querySelector('a[title="Soạn đánh giá"]').getAttribute('href').slice(12);

            const info = [].slice.call(document.querySelector('.row.mb-3').querySelectorAll('.col.text-center.text-sm-left'));
            const age_rated = (info.length >= 1)
                ? info[info.length - 1].querySelectorAll('span')[1].innerHTML
                : null;
            const types = document.querySelector('.mb-0.text-muted.text-truncate').innerHTML
                .replace(/ +?/g, '')
                .replace(/\r?\n|\r/g, '')
                .split('-')[1];
            const duration = (info.length >= 2)
                ? info[info.length - 2].querySelectorAll('span')[1].innerHTML.split(' ')[0]
                : null;
            const trailer_url = 'https://www.youtube.com/embed/' +
                document.querySelector('.btn.btn-outline-light.btn-sm').getAttribute('data-video-url');
            const description = document.querySelector('.mb-3.text-justify').innerHTML;

            const result = {
                name: movie.name,
                moveek_id,
                age_rated,
                imdb_rating: null,
                types,
                duration,
                trailer_url,
                image_url: movie.urlImg,
                description
            };
            list.push(result);
        }
        return list;
    }
}

const crawler = new Crawler();
module.exports = crawler;