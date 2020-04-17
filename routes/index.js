const express = require('express');

const db = require('../models');
const indexHelper = require('../helpers/index');

// Create a router to store all the routes
const router = express.Router();

// Show the home page
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

router.post('/search', (req, res) => {
    indexHelper.handleSearch(req, res);
});

router.get('/about', (req, res) => {
    indexHelper.handleAbout(req, res);
});

router.get('/purchase-ad', (req, res) => {
    indexHelper.handlePurchaseAd(req, res);
});

router.post('/purchase-ad', (req, res) => {
    indexHelper.handlePurchaseAd(req, res);
});

router.get('/contact-us', (req, res) => {
    indexHelper.handleContactUs(req, res);
});

router.post('/contact-us', (req, res) => {
    indexHelper.handleContactUs(req, res);
});

module.exports = router;
