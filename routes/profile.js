const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const auth = require('../middleware/auth');

const ProfileHelper = require('../helpers/profile');
const profileHelper = new ProfileHelper();

let storage = multer.diskStorage({
    destination: './public/images/avatars',
    filename: (req, file, cb) => {
        cb(
            null,
            // Formats file name to "id-username.ext"
            `${
                req.session.userId
            }-${req.session.username.toLowerCase()}${path.extname(
                file.originalname
            )}`
        );
    }
});
const upload = multer({
    dest: '../public/images/avatars',
    storage: storage
});

// Create a router to store all the routes
const router = express.Router();

// Show the edit profile page
router.get('/edit', auth.ensureLoggedIn, (req, res) => {
    profileHelper.handleEditProfile(req, res, db);
});

// Process submitted information for the edit profile page
router.post(
    '/edit',
    auth.ensureLoggedIn,
    upload.single('avatar'),
    (req, res) => {
        profileHelper.handleEditProfile(req, res, db);
    }
);

// Show the profile corresponding to the ID in the URL
router.get('/:id', (req, res) => {
    profileHelper.handleProfile(req, res, db);
});

router.post('/:id/post', auth.ensureLoggedIn, (req, res) => {
    profileHelper.handleProfile(req, res, db);
});

module.exports = router;
