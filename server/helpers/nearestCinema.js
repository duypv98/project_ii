const DomParser = require('dom-parser');
const crawler = require('./crawler.js');

const parser = new DomParser();

class Cinema {
    async suggestShowTime(latitude, longtitude, moveek_id, date) {
        var distances = [];
        var nearest_cinemas = [];
        var suggest_list = [];
        const time = new Date().toLocaleTimeString().slice(0, 5);

        let cine_list = await crawler.crawlCineFromMovie(moveek_id, date)
    }
}