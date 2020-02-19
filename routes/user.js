const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const db = require("../models");

let storage = multer.diskStorage({
    destination: "./public/images",
    filename: (req, file, cb) => {
        const fileType = path.extname(file.originalname);
        cb(null, `${req.session.userId}${fileType}`);
    }
});
const upload = multer({
    dest: "../public/images",
    storage: storage
});

// Create a router to store all the routes
const router = express.Router();

// Show the login page
router.get("/login", (req, res) => {
    res.render("login", { title: "Log in" });
});

// Log out the user and redirect them to the home page
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Process submitted information from the login page
router.post("/login", (req, res) => {
    // Grab submitted information
    let { username, password } = req.body;
    db.User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            // If nobody with the username was found
            req.flash("error_msg", `Invalid username/password combination`);
            res.redirect(req.baseUrl + "/login");
            return;
        } else {
            // If result was found and password hashes match
            if (bcrypt.compareSync(password, user.dataValues.password)) {
                // Store session information
                req.session.loggedIn = true;
                req.session.username = user.dataValues.username;
                req.session.userId = user.dataValues.id;

                // Return user to where they came from if login was trigged by middleware (auth.js)
                let redirectTo = req.session.redirectTo || "/";
                delete req.session.redirectTo;
                res.redirect(redirectTo);
                return;
            } else {
                // If result was found but password doesn't match
                req.flash("error_msg", `Invalid username/password combination`);
                res.redirect(req.baseUrl + "/login");
                return;
            }
        }
    });
});

// Show the register page
router.get("/register", auth.ensureLoggedOut, (req, res) => {
    res.render("register", { title: "Register" });
});

// Process submitted information from the register page
router.post("/register", auth.ensureLoggedOut, (req, res) => {
    // Grab submitted information and convert date to MySQL-compatible format
    let { username, password, email, d_day, d_month, d_year } = req.body;
    let date_of_birth = `${d_year}-${d_month}-${d_day}`;
    let created_at = new Date().toISOString().split("T")[0];

    db.User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != null) {
            // If result was found
            req.flash("error_msg", `Email (${email}) is taken`);
            res.redirect(req.baseUrl + "/register");
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
                    // Create a default profile linked to the created user in the profiles table
                    db.Profile.findOrCreate({
                        where: { user_id: user.dataValues.id },
                        defaults: {
                            user_id: user.dataValues.id
                        }
                    });

                    // Store session information
                    req.session.loggedIn = true;
                    req.session.username = user.dataValues.username;
                    req.session.userId = user.dataValues.id;
                    res.redirect("/");
                    return;
                } else {
                    // If not created AKA already exists
                    req.flash("error_msg", `Username (${username}) is taken`);
                    res.render("register", {
                        title: "Register"
                    });
                    return;
                }
            });
        }
    });
});

router.get("/edit-profile", auth.ensureLoggedIn, (req, res) => {
    db.Profile.findOne({
        where: {
            id: req.session.userId
        }
    }).then(profile => {
        if (!profile) {
            // If result was not found
            req.flash("error_msg", `Error: Please log in again`);
            res.redirect(req.baseUrl + "/login");
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
                // Convert date to form-friendly format and store the information in a dictionary
                dob = user.dataValues.date_of_birth.split("-");
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
                data.title = "Edit Profile";

                // Passes the dictionary to the web page
                res.render("edit-profile", data);
                return;
            });
        }
    });
});

router.post(
    "/edit-profile",
    auth.ensureLoggedIn,
    upload.single("profile-pic"),
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
