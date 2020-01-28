// Import user routes from 'user.js'
const userRouter = require('./user');

const appRouter = (app, fs) => {
    app.get('/', (req, res) => {
        if (req.session.loggedin == null) {
            res.render('login', { title: 'Log In' });
        } else {
            res.render('home', { title: 'Home' });
        }
    });

    // Include user routes in parent router
    userRouter(app, fs);
};

module.exports = appRouter;
