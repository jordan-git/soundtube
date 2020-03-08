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

async function handleEditUserPost(req, res, db) {
    const data = ({ password } = req.body);
    db.User.update(data, {
        where: {
            user_id: req.session.userId
        }
    });

    req.flash('success_msg', 'Your password has been updated');
}

module.exports = {
    handleLogin: handleLoginPost,
    handleRegister: handleRegisterPost,
    handleEditUser: handleEditUserPost
};
