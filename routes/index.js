const express = require('express');

// Create a router to store all the routes
const router = express.Router();

// Show the home page
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

router.get('/purchase-ad', (req, res) => {
    res.render('purchase-ad', { title: 'Purchase Ad' });
});

router.get('/contact-us', (req, res) => {
    res.render('contact-us', { title: 'Contact Us' });
});

module.exports = router;
