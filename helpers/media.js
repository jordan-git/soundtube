const fs = require('fs');
const path = require('path');
const moment = require('moment');
const db = require('../models');
const { Howl, Howler } = require('howler');

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

    async handleMediaGet(req, res) {
        let media = await this.getMedia(req.params.id);

        // If media doesn't exist show 404 error
        if (!media) {
            res.redirect('/error');
            return;
        }

        let comments = await this.getComments(req.params.id);

        // Package information
        media.comments = comments;

        // Increase total views
        media.views = media.views + 1;
        const updatedViews = await db.Media.update(
            {
                views: media.views,
            },
            {
                where: {
                    id: media.id,
                },
            }
        );
        // console.log('/public/media/' + media.filename);
        // let sound = new Howl({
        //     src: [
        //         'media/1-the-entertainer-by-kevin-macleod-from-filmmusic-io.mp3',
        //     ],
        //     autoplay: true,
        //     onloaderror: function () {
        //         console.log('Error!');
        //     },
        // });
        // sound.play();

        // Passes the object to the web page and displays it to the viewer
        res.render('media/media', media);
    }

    async handleMediaPost(req, res) {
        const { content } = req.body;
        const comment = {
            created_at: new moment().format('YYYY-MM-DD'),
            comment: content,
            sender_id: req.session.userId,
            media_id: parseInt(req.params.id),
        };

        await db.MediaComments.create(comment);
        res.redirect(`/m/${req.params.id}`);
    }

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

    async getMedia(id) {
        const media = await db.Media.findOne({
            where: {
                id: id,
            },
        });

        if (media) return media.dataValues;
    }

    async getComments(id) {
        const comments = await db.MediaComments.findAll({
            where: {
                media_id: id,
            },
        });

        if (comments) {
            let allComments = await Promise.all(
                comments.map(async (comment) => {
                    const poster = await db.User.findOne({
                        where: {
                            id: comment.dataValues.sender_id,
                        },
                    });
                    comment.dataValues.poster = poster.dataValues.username;
                    comment.dataValues.created_at = moment(
                        comment.dataValues.created_at,
                        'YYYY-MM-DD'
                    ).format('MMMM Do YYYY');
                    return comment.dataValues;
                })
            );
            return allComments;
        }
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
