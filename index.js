const port = '8000';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

require('./src/modules/setup_database');

const path = require('path');
const fs = require('fs');

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// Formats the generated HTML neatly
app.locals.pretty = true;

// Allows us to access '/src/static' using only '/static'
app.use('/static', express.static(path.join(__dirname, 'src/static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'mysecretkeygoeshere',
        resave: true,
        saveUninitialized: true
    })
);

const routes = require('./src/routes/routes')(app, fs);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
