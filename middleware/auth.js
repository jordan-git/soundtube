module.exports = {
    /*
     * Middleware are functions that may be used whenever a route is called, to perform certain tasks
     *
     * ensureLoggedIn:
     * If not logged in, it stops the user from proceeding and redirects to the login page,
     * remembering what page they came from so they can be sent back once they log in
     *
     * ensureLoggedOut:
     * If logged in, halt the request and send them to the home page
     */
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
