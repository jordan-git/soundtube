const bcrypt = require('bcrypt');
const moment = require('moment');

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
        req.flash('error_msg', `Invalid username/password combination`);
        res.redirect(req.baseUrl + '/login');
        return;
    }

    // If result was found and password hashes match
    if (bcrypt.compareSync(password, user.dataValues.password)) {
        // Store session information
        req.session.loggedIn = true;
        req.session.username = user.dataValues.username;
        req.session.userId = user.dataValues.id;

        // Return user to where they came from if login was trigged by middleware (auth.js)
        let redirectTo = req.session.redirectTo || '/';
        delete req.session.redirectTo;
        res.redirect(redirectTo);
        return;
    } else {
        // If result was found but password doesn't match
        req.flash('error_msg', `Invalid username/password combination`);
        res.redirect(req.baseUrl + '/login');
        return;
    }
}

async function handleRegisterPost(req, res, db) {
    // Grab submitted information and convert date to MySQL-compatible format
    const { username, password, email, day, month, year } = req.body;
    const date_of_birth = new moment(
        `${year}-${month}-${day}`,
        'YYYY-M-D'
    ).format('YYYY-MM-DD');
    const created_at = new moment().format('YYYY-MM-DD');

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
            'error_msg',
            `Username (${username}) and email (${email}) are in use`
        );
        res.redirect(req.baseUrl + '/register');
        return;
    } else if (userTaken != null) {
        req.flash('error_msg', `Username (${username}) is in use`);
        res.redirect(req.baseUrl + '/register');
        return;
    } else if (emailTaken != null) {
        req.flash('error_msg', `Email (${email}) is in use`);
        res.redirect(req.baseUrl + '/register');
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
    res.redirect('/');
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
    const [year, month, day] = user.dataValues.date_of_birth.split('-');
    let data = ({
        stage_name,
        avatar,
        location,
        interests,
        favourite_genres
    } = profile.dataValues);
    data.email = email;
    data.year = year;
    data.month = month;
    data.day = day;
    data.title = 'Edit Profile';

    // Passes the object to the web page
    res.render('edit-profile', data);
}

async function handleEditProfilePost(req, res, db) {
    const data = ({
        stage_name,
        email,
        location,
        interests,
        favourite_genres,
        day,
        month,
        year
    } = req.body);
    const date_of_birth = new Date(year, month, day);
    data.date_of_birth = date_of_birth;

    if (req.file) {
        data.avatar = req.file.filename;
    }

    db.Profile.update(data, {
        where: {
            user_id: req.session.userId
        }
    });

    data.title = 'Edit Profile';
    res.render('edit-profile', data);
}

async function handleProfile(req, res, db) {
    // if (req.params.id == req.session.userId) {
    //     // Possibly display profile with button like edit profile for own profile
    // }

    // Query profile information
    const profile = await db.Profile.findOne({
        where: {
            id: req.params.id
        }
    });

    // If profile doesn't exist show 404 error
    if (!profile) {
        res.redirect('/error');
        return;
    }

    // Query user information
    const user = await db.User.findOne({
        where: {
            id: profile.dataValues.user_id
        }
    });

    // Package information
    const data = ({
        stage_name,
        avatar,
        location,
        interests,
        favourite_genres
    } = profile.dataValues);
    data.title = `${user.dataValues.username}'s Profile`;
    data.username = user.dataValues.username;

    // Passes the object to the web page and displays it to the viewer
    res.render('profile', data);
}

module.exports = {
    handleLogin: handleLoginPost,
    handleRegister: handleRegisterPost,
    handleEditProfile: (req, res, db) => {
        if (req.method == 'GET') handleEditProfileGet(req, res, db);
        else if (req.method == 'POST') handleEditProfilePost(req, res, db);
    },
    handleProfile: handleProfile
};
