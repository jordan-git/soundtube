const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
});

// Connect to the database
db.connect(err => {
    if (err) throw err;

    // Create database if it doesn't exist
    let sql = "CREATE DATABASE IF NOT EXISTS soundtube";
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Use all subsequent queries on the database
    sql = "USE soundtube";
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Create user table
    sql = `CREATE TABLE IF NOT EXISTS users (id int PRIMARY KEY NOT NULL AUTO_INCREMENT, 
        username VARCHAR(24) NOT NULL, 
        password VARCHAR(32) NOT NULL)`;
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Add admin account to the user table if it doesn't already exist
    sql = `INSERT INTO users (id, username, password)
    SELECT * FROM (SELECT NULL, 'admin', 'password') AS tmp
    WHERE NOT EXISTS (
        SELECT username FROM users WHERE username = 'admin'
    ) LIMIT 1`;
    db.query(sql, (err, result) => {
        if (err) throw err;
    });
});

module.exports = db;
