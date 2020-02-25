const express = require('express');
const multer = require('multer');
const path = require('path');

const auth = require('../middleware/auth');
const db = require('../models');
const userHelper = require('../helpers/user');

let storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, `${req.session.userId}-${file.originalname}`);
    }
});
const upload = multer({
    dest: '../public/images',
    storage: storage
});

// Create a router to store all the routes
const router = express.Router();

// Show the login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Log in' });
});

// Log out the user and redirect them to the home page
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Process submitted information from the login page
router.post('/login', (req, res) => {
    userHelper.handleLogin(req, res, db);
});

// Show the register page
router.get('/register', auth.ensureLoggedOut, (req, res) => {
    res.render('register', { title: 'Register' });
});

// Process submitted information from the register page
router.post('/register', auth.ensureLoggedOut, (req, res) => {
    userHelper.handleRegister(req, res, db);
});

// Show the edit profile page
router.get('/edit-profile', auth.ensureLoggedIn, (req, res) => {
    userHelper.handleEditProfile(req, res, db);
});

// Process submitted information for the edit profile page
router.post(
    '/edit-profile',
    auth.ensureLoggedIn,
    upload.single('profile-pic'),
    (req, res) => {
        userHelper.handleEditProfile(req, res, db);
    }
);

router.get('/:id', (req, res) => {
    // if (req.params.id == req.session.userId) {
    //     // Possibly display profile with button like edit profile etc
    // }
    userHelper.handleProfile(req, res, db);
});

module.exports = router;
