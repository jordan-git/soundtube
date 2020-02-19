module.exports = {
    ensureLoggedIn: (req, res, next) => {
        if (req.session.loggedIn) next();
        else {
            req.flash('error_msg', 'You must log in to continue');

            // Save where user came from and to redirect them after login
            req.session.redirectTo = req.originalUrl;

            res.redirect('/u/login');
        }
    },
    ensureLoggedOut: (req, res, next) => {
        if (!req.session.loggedIn) next();
        else {
            req.flash('error_msg', 'You must be logged out to continue');
            res.redirect('/');
        }
    }
};
