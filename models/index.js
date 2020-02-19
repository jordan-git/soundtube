const mysql = require("mysql");
const mysql2 = require("mysql2");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const database = {};

// Create the database connection
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
});

// // Drop database every restart (for testing only)
// conn.query('DROP DATABASE IF EXISTS soundtube;', (err, result) => {
//     if (err) throw err;
// });

// Create an empty database if it doesn't exist
conn.query("CREATE DATABASE IF NOT EXISTS soundtube;", (err, result) => {
    if (err) throw err;
});

/* Connect to database with our ORM (Object-relational mapping)
Using a ORM allows us to connect to and control our database using Javascript */
const sequelize = new Sequelize("soundtube", "root", "password", {
    dialect: "mysql",
    logging: false
});

/*  Reads every single model file in this directory excluding this one and creates an object
    of the table described in the file, then adds each object to the dictionary 'database' */
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
        );
    })
    .forEach(file => {
        let model = sequelize["import"](path.join(__dirname, file));
        database[model.name] = model;
    });

/* Call associate method for each table object to add relationships (foreign keys)
This must be called once all tables have been created or else errors will occur */
Object.keys(database).forEach(modelName => {
    if (database[modelName].associate) {
        database[modelName].associate(database);
    }
});

// Attach our connection to the ORM to our database dictionary with the object for each table
database.sequelize = sequelize;

module.exports = database;
