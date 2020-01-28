const userRouter = (app, fs) => {
    const dbPath = './src/data/database.db';

    // Read
    app.get('/user', (req, res) => {});

    // Create
    app.post('/user', (req, res) => {});

    // Update
    app.put('/user/:id', (req, res) => {});

    // Delete
    app.delete('/user/:id', (req, res) => {});
};

module.exports = userRouter;
