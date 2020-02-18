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

// Create empty database
conn.query("CREATE DATABASE IF NOT EXISTS soundtube;", (err, result) => {
    if (err) throw err;
});

// Connect to database with ORM
const sequelize = new Sequelize("soundtube", "root", "password", {
    dialect: "mysql",
    logging: false
});

// Read all model files in current directory and add one of each object to the dictionary
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

// const userModel = require("./User")(sequelize);
// const profileModel = require("./Profile")(sequelize);
// const mediaModel = require("./Media")(sequelize);
// const mediaGenresModel = require("./MediaGenres")(sequelize);
// const mediaRatingsModel = require("./MediaRatings")(sequelize);
// const profileCommentsModel = require("./ProfileComments")(sequelize);
// const mediaCommentsModel = require("./MediaComments")(sequelize);
// const messagesModel = require("./Messages")(sequelize);

// Call associate method for each table object to add relationships
Object.keys(database).forEach(modelName => {
    if (database[modelName].associate) {
        database[modelName].associate(database);
    }
});

database.sequelize = sequelize;

module.exports = database;
