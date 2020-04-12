const express = require('express');
const multer = require('multer');

const db = require('../models');
const auth = require('../middleware/auth');

let storage = multer.diskStorage({
    destination: './public/media',
    filename: (req, file, cb) => {
        cb(
            null,
            // Formats file name to "id-username.ext"
            `${req.session.userId}-${file.originalname}${path.extname(
                file.originalname
            )}`
        );
    },
});
const upload = multer({
    dest: '../public/media',
    storage: storage,
});

// Create a router to store all the routes
const router = express.Router();

router.get('/most-viewed', (req, res) => {
    res.redirect('/');
});

router.get('/highest-rated', (req, res) => {
    res.redirect('/');
});

router.get('/newest', (req, res) => {
    res.redirect('/');
});

router.get('/my', auth.ensureLoggedIn, (req, res) => {
    res.redirect('/');
});

router.get(
    '/upload',
    auth.ensureLoggedIn,
    upload.single('media'),
    (req, res) => {
        res.redirect('/');
    }
);

router.post('/upload', auth.ensureLoggedIn, (req, res) => {
    res.redirect('/');
});

module.exports = router;
