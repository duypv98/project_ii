const DomParser = require('dom-parser');
const parser = new DomParser();
const crawler = require('./crawler');

class Cinema {
    async suggestShowTime(latitude, longitude, moveek_id, date) {
        var distances = [];
        var nearest_cinemas = [];
        var suggest_list = [];

        const time = new Date().toLocaleTimeString().slice(0, 5);

        let cine_list = await crawler.crawlCineFromMovie(moveek_id, date);

        for (let i = 0; i < cine_list.length; i++) {
            distances.push({
                id: cine_list[i].id,
                name: cine_list[i].name,
                distance: Math.sqrt(Math.pow(cine_list[i].latitude - latitude, 2) + Math.pow(cine_list[i].longitude - longitude, 2))
            })
        }
        distances.sort((a, b) => {
            return a.distance = b.distance
        });
        nearest_cinemas = distances.slice(0, 5);
        for (let i = 0; i < nearest_cinemas.length; i++) {
            let result = await crawler.crawlMovieShowtimeFromCine(moveek_id, nearest_cinemas[i].id, date);
            let result_after = [];
            for (let j = 0; j < result.length; j++) {
                if (result_after.length == 2) {
                    break;
                }
                if (result[j].localeCompare(time) == 1) {
                    result_after.push(result[j])
                }
            }
            if (result_after.length != 0) {
                suggest_list.push({
                    id: nearest_cinemas[i].id,
                    name: nearest_cinemas[i].name,
                    distance: nearest_cinemas[i].distance,
                    showtime: result_after
                })
            }
        }
        return suggest_list;
    }
}

const cinema = new Cinema();
module.exports = cinema;