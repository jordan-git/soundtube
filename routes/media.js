const express = require('express');
const multer = require('multer');

const db = require('../models');
const auth = require('../middleware/auth');

const MediaHelper = require('../helpers/media');
const mediaHelper = new MediaHelper();

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
    mediaHelper.handleMostViewed(req, res);
});

router.get('/highest-rated', (req, res) => {
    mediaHelper.handleHighestRated(req, res);
});

router.get('/newest', (req, res) => {
    mediaHelper.handleNewest(req, res);
});

router.get('/my', auth.ensureLoggedIn, (req, res) => {
    mediaHelper.handleMyMedia(req, res);
});

router.get('/upload', auth.ensureLoggedIn, (req, res) => {
    mediaHelper.handleUpload(req, res);
});

router.post(
    '/upload',
    auth.ensureLoggedIn,
    upload.single('media'),
    (req, res) => {
        mediaHelper.handleUpload(req, res);
    }
);

module.exports = router;
