const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const db = require("../models");

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login", { title: "Log in" });
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;
    db.User.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user) {
            // If result was not found
            req.flash("error_msg", `Invalid username/password combination`);
            res.redirect(req.baseUrl + "/login");
            return;
        } else {
            // if result was found and password hashes match
            if (bcrypt.compareSync(password, user.dataValues.password)) {
                req.session.loggedIn = true;
                req.session.username = user.dataValues.username;
                req.session.userId = user.dataValues.id;
                res.redirect("/");
                return;
            } else {
                req.flash("error_msg", `Invalid username/password combination`);
                res.redirect(req.baseUrl + "/login");
                return;
            }
        }
    });
});

router.get("/register", auth.ensureLoggedOut, (req, res) => {
    res.render("register", { title: "Register" });
});

router.post("/register", auth.ensureLoggedOut, (req, res) => {
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
            console.log("here");
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
                    // If the user was created successfully
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
    res.render("edit-profile", { title: "Edit Profile" });
});

module.exports = router;
