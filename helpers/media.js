const fs = require('fs');
const moment = require('moment');
const db = require('../models');

class MediaHelper {
    handleMostViewed(req, res) {
        if (req.method == 'GET') this.handleMostViewedGet(req, res);
    }

    handleHighestRated(req, res) {
        if (req.method == 'GET') this.handleHighestRatedGet(req, res);
    }

    handleNewest(req, res) {
        if (req.method == 'GET') this.handleNewestGet(req, res);
    }

    handleMyMedia(req, res) {
        if (req.method == 'GET') this.handleMyMediaGet(req, res);
    }

    handleUpload(req, res) {
        if (req.method == 'GET') this.handleUploadGet(req, res);
        else if (req.method == 'POST') this.handleUploadPost(req, res);
    }

    async handleMostViewedGet(req, res) {}

    async handleHighestRatedGet(req, res) {}

    async handleNewestGet(req, res) {}

    async handleMyMediaGet(req, res) {
        res.render('media/my-media', { title: 'My Media' });
    }

    async handleUploadGet(req, res) {
        res.render('media/upload', { title: 'Upload' });
    }

    async handleUploadPost(req, res) {}
}

module.exports = MediaHelper;
