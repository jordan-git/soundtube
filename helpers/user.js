const bcrypt = require("bcrypt");
const moment = require("moment");

async function handleLoginPost(req, res, db) {
    // Store submitted information
    const { username, password } = req.body;

    // Check if user exists
    const user = await db.User.findOne({
        where: {
            username: username
        }
    });

    // If nobody with the username was found
    if (!user) {
        req.flash("error_msg", `Invalid username/password combination`);
        res.redirect(req.baseUrl + "/login");
        return;
    }

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

async function handleRegisterPost(req, res, db) {
    // Grab submitted information and convert date to MySQL-compatible format
    const { username, password, email, day, month, year } = req.body;
    const date_of_birth = new moment(
        `${year}-${month}-${day}`,
        "YYYY-M-D"
    ).format("YYYY-MM-DD");
    const created_at = new moment().format("YYYY-MM-DD");

    // Query database for matching information
    const userTaken = await db.User.findOne({
        where: {
            username: username
        }
    });

    const emailTaken = await db.User.findOne({
        where: {
            email: email
        }
    });

    // Display message if username/email in use
    if (userTaken && emailTaken) {
        req.flash(
            "error_msg",
            `Username (${username}) and email (${email}) are in use`
        );
        res.redirect(req.baseUrl + "/register");
        return;
    } else if (userTaken != null) {
        req.flash("error_msg", `Username (${username}) is in use`);
        res.redirect(req.baseUrl + "/register");
        return;
    } else if (emailTaken != null) {
        req.flash("error_msg", `Email (${email}) is in use`);
        res.redirect(req.baseUrl + "/register");
        return;
    }

    // Create user and linked profile
    const user = await db.User.create({
        username,
        password,
        created_at,
        email,
        date_of_birth
    });
    await db.Profile.create({
        user_id: user.dataValues.id
    });

    // Log in
    req.session.loggedIn = true;
    req.session.username = user.dataValues.username;
    req.session.userId = user.dataValues.id;
    res.redirect("/");
}

async function handleEditProfileGet(req, res, db) {
    // Query user
    const user = await db.User.findOne({
        where: {
            id: req.session.userId
        }
    });

    // Query profile
    const profile = await db.Profile.findOne({
        where: {
            id: user.dataValues.id
        }
    });

    // Store collected information in variables
    const email = user.dataValues.email;
    const [year, month, day] = user.dataValues.date_of_birth.split("-");
    let {
        stage_name,
        profile_pic,
        location,
        interests,
        favourite_genres
    } = profile.dataValues;

    // Package information
    let data = {
        stage_name,
        profile_pic,
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
}

async function handleEditProfilePost(req, res, db) {
    const {
        stage_name,
        email,
        location,
        interests,
        favourite_genres,
        day,
        month,
        year
    } = req.body;
    const profile_pic = req.file.filename;
    const date_of_birth = new Date(year, month, day);
    const data = {
        stage_name,
        email,
        location,
        interests,
        favourite_genres,
        profile_pic,
        date_of_birth
    };
    db.Profile.update(data, {
        where: {
            user_id: req.session.userId
        }
    });

    data.title = "Edit Profile";
    res.render("edit-profile", data);
}

module.exports = {
    handleLogin: handleLoginPost,
    handleRegister: handleRegisterPost,
    handleEditProfile: (req, res, db) => {
        if (req.method == "GET") handleEditProfileGet(req, res, db);
        else if (req.method == "POST") handleEditProfilePost(req, res, db);
    }
};
