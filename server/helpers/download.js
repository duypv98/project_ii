const fs = require('fs');
const request = require('request');

const download = function(uri, fileName, callback) {
    const filePath = './public/images/' + fileName;
    request.head(uri, (err, res) => {
        request(uri).pipe(fs.createWriteStream(filePath)).on('close', callback);
    });
}

module.exports = download;