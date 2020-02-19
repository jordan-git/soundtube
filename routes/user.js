const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const db = require('../models');

let storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        const fileType = path.extname(file.originalname);
        cb(null, `${req.session.userId}${fileType}`);
    }
});
const upload = multer({
    dest: '../public/images',
    storage: storage
});

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { title: 'Log in' });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    db.User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            // If result was not found
            req.flash('error_msg', `Invalid username/password combination`);
            res.redirect(req.baseUrl + '/login');
            return;
        } else {
            // if result was found and password hashes match
            if (bcrypt.compareSync(password, user.dataValues.password)) {
                req.session.loggedIn = true;
                req.session.username = user.dataValues.username;
                req.session.userId = user.dataValues.id;
                let redirectTo = req.session.redirectTo || '/';
                delete req.session.redirectTo;
                res.redirect(redirectTo);
                return;
            } else {
                req.flash('error_msg', `Invalid username/password combination`);
                res.redirect(req.baseUrl + '/login');
                return;
            }
        }
    });
});

router.get('/register', auth.ensureLoggedOut, (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/register', auth.ensureLoggedOut, (req, res) => {
    let { username, password, email, d_day, d_month, d_year } = req.body;
    let date_of_birth = `${d_year}-${d_month}-${d_day}`;
    let created_at = new Date().toISOString().split('T')[0];

    db.User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != null) {
            // If result was found
            req.flash('error_msg', `Email (${email}) is taken`);
            res.redirect(req.baseUrl + '/register');
            return;
        } else {
            db.User.findOrCreate({
                where: { username: username },
                defaults: {
                    password,
                    email,
                    date_of_birth,
                    created_at
                }
            }).then(([user, created]) => {
                if (created) {
                    // If the user was created successfully create a default profile and log them in
                    db.Profile.findOrCreate({
                        where: { user_id: user.dataValues.id },
                        defaults: {
                            user_id: user.dataValues.id
                        }
                    });

                    req.session.loggedIn = true;
                    req.session.username = user.dataValues.username;
                    req.session.userId = user.dataValues.id;
                    res.redirect('/');
                    return;
                } else {
                    // If not created AKA already exists
                    req.flash('error_msg', `Username (${username}) is taken`);
                    res.render('register', {
                        title: 'Register'
                    });
                    return;
                }
            });
        }
    });
});

router.get('/edit-profile', auth.ensureLoggedIn, (req, res) => {
    db.Profile.findOne({
        where: {
            id: req.session.userId
        }
    }).then(profile => {
        if (!profile) {
            // If result was not found
            req.flash('error_msg', `Error: Please log in again`);
            res.redirect(req.baseUrl + '/login');
            return;
        } else {
            let {
                stage_name,
                location,
                interests,
                favourite_genres
            } = profile.dataValues;
            db.User.findOne({
                where: {
                    id: req.session.userId
                }
            }).then(user => {
                dob = user.dataValues.date_of_birth.split('-');
                let year = dob[0],
                    month = dob[1],
                    day = dob[2];
                let email = user.dataValues.email;
                let data = {
                    stage_name,
                    email,
                    location,
                    interests,
                    favourite_genres,
                    year,
                    month,
                    day
                };
                data.title = 'Edit Profile';
                res.render('edit-profile', data);
                return;
            });
        }
    });
});

router.post(
    '/edit-profile',
    auth.ensureLoggedIn,
    upload.single('profile-pic'),
    (req, res) => {
        let {
            stage_name,
            email,
            location,
            interests,
            favourite_genres,
            profile_pic,
            day,
            month,
            year
        } = req.body;
        let date_of_birth = `${year}-${month}-${day}`;
        let data = {
            stage_name,
            email,
            location,
            interests,
            favourite_genres,
            profile_pic,
            date_of_birth
        };
        console.log(req.file);
        //db.Profile.update();
    }
);

module.exports = router;
