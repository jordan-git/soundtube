const appRouter = (app, fs) => {
    app.get('/', (req, res) => {
        res.render('index', {title: 'Home'});
    });
}

module.exports = appRouter;