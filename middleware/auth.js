module.exports = {
    ensureLoggedIn: (req, res, next) => {
        if (req.session.loggedIn) next();
        else {
            req.flash("error_msg", "You must log in to continue");
            res.redirect("/u/login");
        }
    },
    ensureLoggedOut: (req, res, next) => {
        if (!req.session.loggedIn) next();
        else {
            req.flash("error_msg", "You must be logged out to continue");
            res.redirect("/");
        }
    }
};
