const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});

db.connect(err => {
    if (err) throw err;

    let sql1 = 'CREATE DATABASE IF NOT EXISTS soundtube';

    db.query(sql1, (err, result) => {
        if (err) throw err;
        db.end();
    });

    let sql2 = 'USE soundtube';

    db.query(sql2, (err, result) => {
        if (err) throw err;
        db.end();
    });

    let sql3 = `CREATE TABLE IF NOT EXISTS users (id int PRIMARY KEY NOT NULL AUTO_INCREMENT, 
        username VARCHAR(24) NOT NULL, 
        password VARCHAR(32) NOT NULL)`;

    db.query(sql3, (err, result) => {
        if (err) throw err;
        db.end();
    });

    // Add admin account to database if it doesn't already exist
    let sql4 = `INSERT INTO users (id, username, password)
    SELECT * FROM (SELECT NULL, 'admin', 'password') AS tmp
    WHERE NOT EXISTS (
        SELECT username FROM users WHERE username = 'admin'
    ) LIMIT 1`;

    db.query(sql4, (err, result) => {
        if (err) throw err;
        db.end();
    });
});

module.exports = db;
