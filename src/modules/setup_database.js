const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
    // database: 'soundtube'
});

db.connect(err => {
    if (err) throw err;

    let sql = 'CREATE DATABASE IF NOT EXISTS soundtube';
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    let sql2 = 'USE soundtube';
    db.query(sql2, (err, result) => {
        if (err) throw err;
    });

    let sql3 =
        'CREATE TABLE IF NOT EXISTS users (id int PRIMARY KEY AUTO_INCREMENT, username VARCHAR(24), password VARCHAR(24))';
    db.query(sql3, (err, result) => {
        if (err) throw err;
    });

    let sql4 = "INSERT INTO users VALUES (NULL, 'admin', 'admin')";
    db.query(sql4, (err, result) => {
        if (err) throw err;
    });
});
