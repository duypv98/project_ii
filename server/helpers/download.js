import fs from 'fs';
import request from 'request';

const download = function (uri, fileName, callBack) {
    const filePath = './public/images/' + fileName;
    request.head(uri, (err, res) => {
        request(uri).pipe(fs.createWriteStream(filePath)).on('close', callBack);
    });
};

module.exports = download;