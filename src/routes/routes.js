const pw = require('password-hash');

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

const appRouter = (app, fs, db) => {
    app.get('/', (req, res) => {
        res.render('home', {
            title: 'Home',
            logged_in: req.session.logged_in,
            username: req.session.username
        });
    });

    app.get('/login', (req, res) => {
        // If logged in, do nothing
        if (isLoggedIn(req)) {
            return;
        }

        res.render('login', { title: 'Log In' });
    });

    app.post('/login', (req, res) => {
        // Do nothing if already logged in
        if (isLoggedIn(req)) return;

        // Storing submitted information
        let username = req.body.username;
        let password = req.body.password;

        // Checking if the username/password combination exists
        let sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, username, (err, result) => {
            if (err) throw err;

            // If the user doesn't exist
            if (result.length == 0) {
                res.render('login', {
                    title: 'Log In',
                    response: 'Invalid username/password combination'
                });
            } else {
                // If password matches hash
                if (pw.verify(password, result[0].password)) {
                    req.session.logged_in = true;
                    req.session.username = result[0].username;
                    res.redirect('/');
                } else {
                    res.render('login', {
                        title: 'Log In',
                        response: 'Invalid username/password combination'
                    });
                }
            }
        });
    });

    app.get('/log-out', (req, res) => {
        // If logged in, log out
        if (isLoggedIn(req)) {
            req.session.destroy();
            res.redirect('/');
        }
    });

    app.get('/register', (req, res) => {
        // If currently logged in, return to home
        if (isLoggedIn(req)) {
            res.redirect('/');
            return;
        }
        res.render('register', { title: 'Register' });
    });

    app.post('/register', (req, res) => {
        // If currently logged in, return to home
        if (isLoggedIn(req)) {
            res.redirect('/');
            return;
        }

        // Storing submitted information
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let dob = `${req.body.year}-${req.body.month}-${req.body.day}`;

        // Checking if the username exists
        let sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, username, (err, result) => {
            if (err) throw err;

            // If the username exists
            if (result.length > 0) {
                res.render('register', {
                    title: 'Register',
                    response: 'Username is already in use'
                });
            } else {
                // Turn password into hash and store in database
                password = pw.generate(password);
                sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
                db.query(sql, [username, password], (err, result) => {
                    if (err) throw err;
                });

                sql = 'SELECT * FROM users WHERE username = ?';
                db.query(sql, username, (err, result) => {
                    if (err) throw err;
                    sql =
                        'INSERT INTO profiles (user_id, email, dob) VALUES (?, ?, ?)';
                    db.query(
                        sql,
                        [result[0].user_id, email, dob],
                        (err, result) => {
                            if (err) throw err;
                        }
                    );
                });

                req.session.logged_in = true;
                req.session.username = username;
                // TODO: Registration success message
                res.redirect('/');
            }
        });
    });

    app.get('/edit-profile', (req, res) => {
        // If not logged in, request login
        if (!isLoggedIn(req)) {
            res.redirect('/login');
            return;
        }

        let sql = 'SELECT * FROM users WHERE username = ?';

        db.query(sql, req.session.username, (err, result) => {
            if (err) throw err;
            let user_id = result[0].user_id;
            let username = result[0].username;

            sql = 'SELECT * FROM profiles WHERE user_id = ?';
            db.query(sql, user_id, (err, result) => {
                let stage_name = result[0].stage_name;
                let email = result[0].email;
                // TODO: DOB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                let dob = results[0].dob;
                let location = result[0].location;
                let interests = result[0].interests;
                let favourite_genres = result[0].favourite_genres;

                res.render('edit-profile', {
                    title: 'Edit Profile',
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

    app.post('/edit-profile', (req, res) => {
        if (!isLoggedIn(req)) {
            res.redirect('/');
            return;
        }

        let stage_name = req.body.stage_name;
        let location = req.body.location;
        let interests = req.body.interests;
        let favourite_genres = req.body.favourite_genres;
        let email = req.body.email;
        let dob = `${req.body.year}-${req.body.month}-${req.body.day}`;

        let sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, req.session.username, (err, result) => {
            if (err) throw err;
            let user_id = result[0].user_id;

            sql =
                'UPDATE profiles SET stage_name = ?, email = ?, dob = ?, location = ?, interests = ?, favourite_genres = ? WHERE user_id = ?';
            db.query(
                sql,
                [
                    stage_name,
                    email,
                    dob,
                    location,
                    interests,
                    favourite_genres,
                    user_id
                ],
                (err, result) => {
                    if (err) throw err;
                }
            );
        });
        res.redirect('/edit-profile');
    });
};

module.exports = appRouter;
