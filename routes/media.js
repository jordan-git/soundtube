const express = require('express');

const mediaHelper = require('../helpers/media');
const db = require('../models');

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

router.post('/search', (req, res) => {
    mediaHelper.handleSearch(req, res, db);
});

module.exports = router;
