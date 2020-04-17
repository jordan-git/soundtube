/*
 * Helpers are files containing functions used in the route files. They are placed here
 *
 * handleSearch:
 * Query the database for user/media results like the search term
 */

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../models');

async function handleSearch(req, res) {
    // Three SQL patterns to search for
    const patterns = [`%${req.body.q}`, `${req.body.q}%`, `%${req.body.q}%`];

    let users = [];
    let media = [];

    for (const pattern of patterns) {
        // Query for a username that is like the search term
        const userResults = await db.User.findAll({
            where: {
                username: {
                    [Op.like]: pattern,
                },
            },
        });

        // If not results are found, move to next pattern
        if (!userResults) {
            continue;
        }

        // For each set of results, add the object of results to the users array
        userResults.forEach((user) => {
            users.push(user.dataValues);
        });
    }

    // If users were found matching the pattern, extract the data we want and replace old array with this data
    if (users) {
        let userData = [];
        users.forEach((user) => {
            userData.push({
                id: user.id,
                username: user.username,
            });
        });
        users = userData;
    }

    for (const pattern of patterns) {
        // Three SQL patterns to search for
        const mediaResults = await db.Media.findAll({
            where: {
                title: {
                    [Op.like]: pattern,
                },
            },
        });

        // If not results are found, move to next pattern
        if (!mediaResults) {
            continue;
        }

        // For each set of results, add the object of results to the media array
        mediaResults.forEach((m) => {
            media.push(m.dataValues);
        });
    }

    // If media was found matching the pattern, extract the data we want and replace old array with this data
    if (media) {
        let mediaData = [];
        media.forEach((m) => {
            mediaData.push(m);
        });
        media = mediaData;
    }

    console.log(users);
    console.log(media);
}

async function handleAboutGet(req, res) {
    res.render('about', { title: 'About' });
}

async function handlePurchaseAdGet(req, res) {
    res.render('purchase-ad', { title: 'Purchase Ad' });
}

async function handlePurchaseAdPost(req, res) {
    const purchaseAdPost = await db.PurchaseAd.create(req.body);

    req.flash('success_msg', 'Your message has been submitted successfully');
    res.redirect('/');
}

async function handleContactUsGet(req, res) {
    res.render('contact-us', { title: 'Contact Us' });
}

async function handleContactUsPost(req, res) {
    const contactUsPost = await db.ContactUs.create(req.body);

    req.flash('success_msg', 'Your message has been submitted successfully');
    res.redirect('/');
}

module.exports = {
    handleSearch: handleSearch,
    handleAbout: handleAboutGet,
    handlePurchaseAd: (req, res) => {
        if (req.method == 'GET') handlePurchaseAdGet(req, res);
        else if (req.method == 'POST') handlePurchaseAdPost(req, res);
    },
    handleContactUs: (req, res) => {
        if (req.method == 'GET') handleContactUsGet(req, res);
        else if (req.method == 'POST') handleContactUsPost(req, res);
    },
};
