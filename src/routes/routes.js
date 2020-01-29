// Import user routes from 'user.js'
const userRouter = require('./user');

const appRouter = (app, fs) => {
    app.get('/', (req, res) => {
        res.render('home', { title: 'Home' });
    });

    app.get('/login', (req, res) => {
        res.render('login', { title: 'Log In' });
    });

    app.get('/register', (req, res) => {
        res.render('register', { title: 'Register' });
    });

    // Include user routes in parent router
    userRouter(app, fs);
};

module.exports = appRouter;
