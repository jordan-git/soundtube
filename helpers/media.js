const fs = require('fs');
const moment = require('moment');
const db = require('../models');

class MediaHelper {
    handleMedia(req, res) {
        if (req.method == 'GET') this.handleMediaGet(req, res);
        else if (req.method == 'POST') this.handleMediaPost(req, res);
    }

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

    async handleMediaGet(req, res) {}

    async handleMediaPost(req, res) {}

    async handleMostViewedGet(req, res) {
        const media = await this.getMostViewedMedia();
        res.render('media/sorted', { title: 'Most Viewed', media: media });
    }

    async handleHighestRatedGet(req, res) {}

    async handleNewestGet(req, res) {
        const media = await this.getNewestMedia();
        res.render('media/sorted', { title: 'Newest', media: media });
    }

    async handleMyMediaGet(req, res) {
        const profileEntry = await db.Profile.findOne({
            where: {
                user_id: req.session.userId,
            },
        });

        const media = await this.getMyMedia(profileEntry.dataValues.id);

        res.render('media/my-media', { title: 'My Media', media: media });
    }

    async handleUploadGet(req, res) {
        res.render('media/upload', { title: 'Upload' });
    }

    async handleUploadPost(req, res) {
        req.body.filename = req.file.filename;
        req.body.views = 0;
        req.body.created_at = new moment().format('YYYY-MM-DD');

        const profileEntry = await db.Profile.findOne({
            where: {
                id: req.session.userId,
            },
        });

        req.body.profile_id = profileEntry.dataValues.id;

        const mediaEntry = await db.Media.create(req.body);

        req.flash('success_msg', `Your media has been successfully uploaded`);
        res.redirect('/');
    }

    async getMostViewedMedia() {
        const media = await db.Media.findAll({
            order: [['views', 'DESC']],
        });

        const allMedia = media.map((media) => {
            media.dataValues.created_at = moment(
                media.dataValues.created_at,
                'YYYY-MM-DD'
            ).format('MMMM Do YYYY');
            return media.dataValues;
        });

        return allMedia;
    }

    async getNewestMedia() {
        const media = await db.Media.findAll({
            order: [['id', 'DESC']],
        });

        const allMedia = media.map((media) => {
            media.dataValues.created_at = moment(
                media.dataValues.created_at,
                'YYYY-MM-DD'
            ).format('MMMM Do YYYY');
            return media.dataValues;
        });

        return allMedia;
    }

    async getMyMedia(id) {
        const media = await db.Media.findAll({
            where: {
                profile_id: id,
            },
        });

        const allMedia = media.map((media) => {
            media.dataValues.created_at = moment(
                media.dataValues.created_at,
                'YYYY-MM-DD'
            ).format('MMMM Do YYYY');
            return media.dataValues;
        });

        return allMedia;
    }
}

module.exports = MediaHelper;
