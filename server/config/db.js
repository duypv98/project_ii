'use strict'
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('DATABASE OK!');
});

module.exports = db;