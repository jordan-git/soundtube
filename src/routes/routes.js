const pw = require("password-hash");

const appRouter = (app, fs, db) => {
    // Helper modules
    const dbHelper = require("../modules/db_helper")(db);

    console.log(dbHelper);

    // Helper functions
    // Return true if logged in else false
    const isLoggedIn = req => {
        // req.session.logged_in != null ? true : false;
        if (req.session.logged_in != null) {
            return true;
        } else {
            return false;
        }
    };

    // Log in the user
    const logIn = (req, username, user_id) => {
        req.session.logged_in = true;
        req.session.username = username;
        req.session.user_id = user_id;
    };

    // Log out the user
    const logOut = req => {
        req.session.destroy();
    };

    // // Saves a user's profile info when passed the request and database
    // const updateUser = req => {
    //     let stage_name = req.body.stage_name;
    //     let location = req.body.location;
    //     let interests = req.body.interests;
    //     let favourite_genres = req.body.favourite_genres;
    //     let email = req.body.email;
    //     let dob = `${req.body.year}-${req.body.month}-${req.body.day}`;

    //     sql = `UPDATE profiles
    //     SET email = '${email}', dob = '${dob}', stage_name = '${stage_name}', location = '${location}', interests = '${interests}', favourite_genres = '${favourite_genres}'
    //     WHERE user_id = ${req.session.user_id}`;

    //     db.query(sql, (err, result) => {
    //         if (err) throw err;
    //     });
    // };

    // // Adds a user to the database taking in two lists with the field and value
    // const addUser = (fields, values) => {
    //     // Surround each value in quotes
    //     for (let i = 0; i < values.length; i++) {
    //         // If field is password, hash it
    //         if (fields[i] == "password") {
    //             values[i] = pw.generate(values[i]);
    //         }

    //         values[i] = "'" + values[i] + "'";
    //     }

    //     // Format each value for SQL
    //     fields = fields.join(", ");
    //     values = values.join(", ");

    //     let sql = `INSERT INTO users (${fields}) VALUES (${values})`;
    //     db.query(sql, (err, result) => {
    //         if (err) throw err;
    //     });
    // };

    app.get("/", (req, res) => {
        res.render("home", {
            title: "Home",
            logged_in: req.session.logged_in,
            username: req.session.username
        });
    });

    app.get("/login", (req, res) => {
        // If logged in, do nothing
        if (isLoggedIn(req)) {
            return;
        }

        res.render("login", { title: "Log In" });
    });

    app.post("/login", (req, res) => {
        // Do nothing if already logged in
        if (isLoggedIn(req)) return;

        // Storing submitted information
        let username = req.body.username;
        let password = req.body.password;

        // Checking if the username/password combination exists
        let sql = `SELECT * FROM users WHERE username = '${username}'`;
        db.query(sql, (err, result) => {
            if (err) throw err;

            // If the user doesn't exist
            if (result.length == 0) {
                res.render("login", {
                    title: "Log In",
                    response: "Invalid username/password combination"
                });
            } else {
                // If password matches hash
                if (pw.verify(password, result[0].password)) {
                    logIn(req, result[0].username, result[0].user_id);
                    res.redirect("/");
                } else {
                    res.render("login", {
                        title: "Log In",
                        response: "Invalid username/password combination"
                    });
                }
            }
        });
    });

    app.get("/log-out", (req, res) => {
        // If logged in, log out
        if (isLoggedIn(req)) {
            logOut(req);
            res.redirect("/");
        }
    });

    app.get("/register", (req, res) => {
        // If currently logged in, return to home
        if (isLoggedIn(req)) {
            res.redirect("/");
            return;
        }
        res.render("register", { title: "Register" });
    });

    app.post("/register", (req, res) => {
        // If currently logged in, return to home
        if (isLoggedIn(req)) {
            res.redirect("/");
            return;
        }

        // Storing submitted information
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let dob = `${req.body.year}-${req.body.month}-${req.body.day}`;

        // Checking if the username exists
        let sql = `SELECT * FROM users WHERE username = '${username}'`;
        db.query(sql, (err, result) => {
            if (err) throw err;

            // If the username exists
            if (result.length > 0) {
                res.render("register", {
                    title: "Register",
                    response: "Username is already in use"
                });
            } else {
                // Turn password into hash and store in database
                dbHelper.addUser(
                    ["username", "password"],
                    [username, password]
                );

                sql = `SELECT * FROM users WHERE username = ${username}`;
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    let user_id = result[0].user_id;
                    sql = `INSERT INTO profiles (user_id, email, dob) VALUES ('${user_id}', '${email}', '${dob}')`;
                    db.query(sql, (err, result) => {
                        if (err) throw err;

                        logIn(req, username, user_id);
                    });
                });

                // TODO: Registration success message
                res.redirect("/");
            }
        });
    });

    app.get("/edit-profile", (req, res) => {
        // If not logged in, request login
        if (!isLoggedIn(req)) {
            res.redirect("/login");
            return;
        }

        let sql = `SELECT * FROM users WHERE username = '${req.session.username}'`;

        db.query(sql, (err, result) => {
            if (err) throw err;
            let user_id = result[0].user_id;
            let username = result[0].username;

            sql = `SELECT * FROM profiles WHERE user_id = '${user_id}'`;
            db.query(sql, (err, result) => {
                let stage_name = result[0].stage_name;
                let email = result[0].email;
                let dob = result[0].dob;
                let year = dob.getFullYear();
                let month = dob.getMonth();
                let day = dob.getDate();
                let location = result[0].location;
                let interests = result[0].interests;
                let favourite_genres = result[0].favourite_genres;

                res.render("edit-profile", {
                    title: "Edit Profile",
                    logged_in: req.session.logged_in,
                    username: username,
                    email: email,
                    day: day,
                    month: month,
                    year: year,
                    stage_name: stage_name,
                    location: location,
                    interests: interests,
                    favourite_genres: favourite_genres
                });
            });
        });
    });

    app.post("/edit-profile", (req, res) => {
        // If not logged in, request login
        if (!isLoggedIn(req)) {
            res.redirect("/");
            return;
        }

        //TODO FIX UPDATE
        dbHelper.updateUser(req);
        res.redirect("/edit-profile");
    });

    app.get("/test", (req, res) => {
        // dbHelper.addUser(["username", "password"], ["123", "123"]);
        dbHelper.deleteUser("jordan");
    });
};

module.exports = appRouter;
