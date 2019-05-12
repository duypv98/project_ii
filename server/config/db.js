'use strict'
import mysql from 'mysql';

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'project_ii'
});

db.connect((err) => {
    if (err) throw err;
    console.log('DATABASE OK!');
});

module.exports = db;