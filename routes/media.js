const express = require('express');

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

router.get('/my', (req, res) => {
    res.redirect('/');
});

router.get('/upload', (req, res) => {
    res.redirect('/');
});

router.post('/upload', (req, res) => {
    res.redirect('/');
});

module.exports = router;
