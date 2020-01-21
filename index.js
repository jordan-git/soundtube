const port = '8000'

const express = require('express')
const bodyParser = require("body-parser");

const app = express();

const path = require("path");
const fs = require("fs");

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");
app.locals.pretty = true; // Format generated HTML neatly

app.use('/static', express.static(path.join(__dirname, 'src/static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const routes = require("./src/routes/routes")(app, fs);

app.listen(port, () => {
	console.log(`Listening to requests on http://localhost:${port}`);
});