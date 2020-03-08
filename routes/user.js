const express = require('express');

const auth = require('../middleware/auth');
const db = require('../models');
const userHelper = require('../helpers/user');

// Create a router to store all the routes
const router = express.Router();

// Show the login page
router.get('/login', (req, res) => {
    res.render('user/login', { title: 'Log in' });
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
    res.render('user/register', { title: 'Register' });
});

// Process submitted information from the register page
router.post('/register', auth.ensureLoggedOut, (req, res) => {
    userHelper.handleRegister(req, res, db);
});

// Show the edit user page
router.get('/edit', auth.ensureLoggedIn, (req, res) => {
    res.render('user/edit', { title: 'Edit User' });
});

// Process submitted information from the edit user page
router.post('/edit', auth.ensureLoggedIn, (req, res) => {
    userHelper.handleEditUser(req, res, db);
});

module.exports = router;
