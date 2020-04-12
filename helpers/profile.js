const fs = require('fs');
const moment = require('moment');
const db = require('../models');

class ProfileHelper {
    handleProfile(req, res) {
        if (req.method == 'GET') this.handleProfileGet(req, res);
        else if (req.method == 'POST') this.handleProfilePost(req, res);
    }

    handleEditProfile(req, res) {
        if (req.method == 'GET') this.handleEditProfileGet(req, res);
        else if (req.method == 'POST') this.handleEditProfilePost(req, res);
    }

    async handleProfileGet(req, res) {
        // Query profile information
        let profile = await this.getProfile(req.params.id);

        // If profile doesn't exist show 404 error
        if (!profile) {
            res.redirect('/error');
            return;
        }

        // Query user information
        let user = await this.getUser(profile.user_id);

        let comments = await this.getComments(profile.user_id);

        // Package information
        profile.title = `${user.username}'s Profile`;
        profile.username = user.username;
        profile.comments = comments;

        // Passes the object to the web page and displays it to the viewer
        res.render('profile/profile', profile);
    }

    async handleProfilePost(req, res) {
        const { content } = req.body;
        const comment = {
            created_at: new moment().format('YYYY-MM-DD'),
            comment: content,
            poster_id: req.session.userId,
            profile_id: parseInt(req.params.id),
        };
        await db.ProfileComments.create(comment);
        res.redirect(`/p/${req.params.id}`);
    }

    async handleEditProfileGet(req, res) {
        // Query user
        const user = await this.getUser(req.session.userId);

        // Query profile
        const profile = await this.getProfile(user.id);

        // Store collected information in variables
        const email = user.email;
        const [year, month, day] = user.date_of_birth.split('-');

        profile.email = email;
        profile.year = year;
        profile.month = month;
        profile.day = day;
        profile.title = 'Edit Profile';

        // Passes the object to the web page
        res.render('profile/edit', profile);
    }

    async handleEditProfilePost(req, res) {
        // Format date for database
        const date_of_birth = new moment(
            `${req.body.year}-${req.body.month}-${req.body.day}`,
            'YYYY-MM-DD'
        ).format('YYYY-MM-DD');
        const email = req.body.email;

        // Update info stored in the user table (email + dob)
        await db.User.update(
            {
                date_of_birth,
                email,
            },
            {
                where: {
                    id: req.session.userId,
                },
            }
        );

        // If a file was uploaded with the request
        if (req.file && req.body.reset_avatar != 'Reset') {
            req.body.avatar = req.file.filename;
        }

        // If "reset avatar" box was ticked delete avatar
        if (req.body.reset_avatar == 'Reset') {
            req.body.avatar = '';

            // Get array of all files in avatar directory
            const files = fs.readdirSync('./public/images/avatars');
            const oldAvatarName = `${
                req.session.userId
            }-${req.session.username.toLowerCase()}.`;

            files.forEach((file) => {
                let search = file.search(oldAvatarName);
                if (search >= 0) {
                    // Async function to delete avatar file and database entry
                    this.deleteAvatar(req, () => {
                        db.Profile.update(req.body, {
                            where: {
                                user_id: req.session.userId,
                            },
                        });

                        req.body.title = 'Edit Profile';
                        req.body.success = 'Your avatar has been deleted';
                        res.render('profile/edit', req.body);
                    });
                }
            });
        } else {
            await db.Profile.update(req.body, {
                where: {
                    user_id: req.session.userId,
                },
            });

            req.body.title = 'Edit Profile';
            res.render('profile/edit', req.body);
        }
    }

    async deleteAvatar(req, cb) {
        // Delete image
        const profile = await this.getProfile(req.session.userId);
        fs.unlinkSync('./public/images/avatars/' + profile.avatar);

        // Set avatar value in database to null
        await db.Profile.update(
            {
                avatar: null,
            },
            {
                where: {
                    user_id: req.session.userId,
                },
            }
        );
        cb();
    }

    // Return user from database
    async getUser(id) {
        const user = await db.User.findOne({
            where: {
                id: id,
            },
        });

        if (user) return user.dataValues;
    }

    // Return profile from database
    async getProfile(id) {
        const profile = await db.Profile.findOne({
            where: {
                id: id,
            },
        });

        if (profile) return profile.dataValues;
    }

    async getComments(id) {
        const comments = await db.ProfileComments.findAll({
            where: {
                profile_id: id,
            },
        });

        if (comments) {
            let allComments = await Promise.all(
                comments.map(async (comment) => {
                    const poster = await db.User.findOne({
                        where: {
                            id: comment.dataValues.poster_id,
                        },
                    });
                    comment.dataValues.poster = poster.dataValues.username;
                    comment.dataValues.created_at = moment(
                        comment.dataValues.created_at
                    ).format('MMMM Do YYYY');
                    return comment.dataValues;
                })
            );
            return allComments;
        }
    }
}

module.exports = ProfileHelper;
