function setRoutes(app) {
    app.get('/', (req, res) => {
        res.send('Welcome to the Node.js Project!');
    });

    app.get('/api', (req, res) => {
        res.json({ message: 'API is working!' });
    });

}

module.exports = setRoutes;