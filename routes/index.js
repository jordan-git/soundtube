const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Catch unused routes for 404 (Must be at the end)
router.get('*', (req, res) => {
    res.status(404);
    res.render('not-found', { title: 'Page Not Found' });
});

module.exports = router;
