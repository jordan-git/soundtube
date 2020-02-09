// Port to host the server on
const port = "8000";

// Main imports
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

// Creating express app
const app = express();

// Database connection
const db = require("./src/modules/database");

// For reading/writing files
const path = require("path");
const fs = require("fs");

// Configuring the template engine
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");

// Formats the HTML generated by Pug neatly
app.locals.pretty = true;

// Allows us to access '/src/static' by using just '/static' in a browser
app.use("/static", express.static(path.join(__dirname, "src/static")));

// Allows us to access '/src/modules' by using just '/modules' in a browser
app.use("/modules", express.static(path.join(__dirname, "src/modules")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuring modules
app.use(
    session({
        secret: "mysecretkeygoeshere",
        resave: true,
        saveUninitialized: true
    })
);

// Gathering routes and giving them access to the app, file system and database
const routes = require("./src/routes/routes")(app, fs, db);

// Listen for connection requests to our application
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
