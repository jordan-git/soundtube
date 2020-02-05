const appRouter = (app, fs, db) => {
    app.get("/", (req, res) => {
        res.render("home", { title: "Home" });
    });

    app.get("/login", (req, res) => {
        res.render("login", { title: "Log In" });
    });

    app.post("/login", (req, res) => {
        // Storing submitted information
        let username = req.body.username;
        let password = req.body.password;

        // Checking if the username/password combination exists
        let sql = "SELECT * FROM users WHERE username = ? AND password = ?";
        db.query(sql, [username, password], (err, result) => {
            if (err) throw err;

            // If the user doesn't exist
            if (result.length == 0) {
                res.render("login", {
                    title: "Log In",
                    response: "Invalid username/password combination."
                });
            } else {
                // Log in the user
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

        // Checking if the username exists
        let sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, username, (err, result) => {
            if (err) throw err;

            // If the user exists
            if (result.length > 0) {
                res.render("register", {
                    title: "Register",
                    response: "Username is already in use."
                });
            } else {
                // Add user to database
            }
        });
    });
};

module.exports = appRouter;
