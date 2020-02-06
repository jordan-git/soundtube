const pw = require("password-hash");

const appRouter = (app, fs, db) => {
    app.get("/", (req, res) => {
        res.render("home", {
            title: "Home",
            logged_in: req.session.logged_in,
            username: req.session.username
        });
    });

    app.get("/login", (req, res) => {
        // If logged in, log out
        if (req.session.logged_in) {
            req.session.destroy();
            res.redirect("/");
            return;
        }

        res.render("login", { title: "Log In" });
    });

    app.post("/login", (req, res) => {
        // Do nothing if already logged in
        if (req.session.logged_in) return;

        // Storing submitted information
        let username = req.body.username;
        let password = req.body.password;

        // Checking if the username/password combination exists
        let sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, username, (err, result) => {
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
                    req.session.logged_in = true;
                    req.session.username = result[0].username;
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

    app.get("/register", (req, res) => {
        res.render("register", { title: "Register" });
    });

    app.post("/register", (req, res) => {
        // Storing submitted information
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let dob = `${req.body.year}-${req.body.month}-${req.body.day}`;

        // Checking if the username exists
        let sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, username, (err, result) => {
            if (err) throw err;

            // If the username exists
            if (result.length > 0) {
                res.render("register", {
                    title: "Register",
                    response: "Username is already in use"
                });
            } else {
                // Turn password into hash and store in database
                password = pw.generate(password);
                sql =
                    "INSERT INTO users (username, password, email, dob) VALUES (?, ?, ?, ?)";
                db.query(
                    sql,
                    [username, password, email, dob],
                    (err, result) => {
                        if (err) throw err;
                    }
                );

                req.session.logged_in = true;
                req.session.username = username;
                // TODO: Registration success message
                res.redirect("/");
            }
        });
    });
};

module.exports = appRouter;
