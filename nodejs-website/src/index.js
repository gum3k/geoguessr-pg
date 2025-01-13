const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'website' directory
app.use(express.static(path.join(__dirname, 'website')));

// Serve static files from the 'locations' directory
app.use('/locations', express.static(path.join(__dirname, '..', '..', 'locations')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'index.html'));
});

// API route to fetch the API key
app.get('/apikey', (req, res) => {
    fs.readFile(path.join(__dirname, '..', '..', 'apikey.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading API key:', err);
            res.status(500).send('Error reading API key');
        } else {
            res.send(data.trim());
        }
    });
});

// Add more routes as needed

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});