const mysql = require('mysql');
const pw = require('password-hash');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});

// Connect to the database
db.connect(err => {
    if (err) throw err;

    // Drop database if it exists (for testing only while new rows are added)
    let sql = 'DROP DATABASE IF EXISTS soundtube';
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Create database if it doesn't exist
    sql = 'CREATE DATABASE IF NOT EXISTS soundtube';
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Use all subsequent queries on the database
    sql = 'USE soundtube';
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Create user table
    sql = `CREATE TABLE IF NOT EXISTS users (user_id int PRIMARY KEY NOT NULL AUTO_INCREMENT, 
        username VARCHAR(24) NOT NULL, 
        password VARCHAR(128) NOT NULL)`;
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Create profile table
    sql = `CREATE TABLE IF NOT EXISTS profiles (profile_id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
        email VARCHAR(64) NOT NULL,
        dob DATE NOT NULL,
        stage_name VARCHAR(32),
        location VARCHAR(48), 
        interests VARCHAR(48),
        favourite_genres VARCHAR(64),
        user_id INT,
        FOREIGN KEY(user_id)
            REFERENCES users(user_id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
    });

    // Add admin account to the user table if it doesn't already exist
    // let password_hash = pw.generate("password");
    // sql = `INSERT INTO users (user_id, username, password, email, dob)
    // SELECT * FROM (SELECT NULL, 'admin', '${password_hash}', 'admin@admin.com', '2020-01-01') AS tmp
    // WHERE NOT EXISTS (
    //     SELECT username FROM users WHERE username = 'admin'
    // ) LIMIT 1`;
    // db.query(sql, (err, result) => {
    //     if (err) throw err;
    // });
});

module.exports = db;
