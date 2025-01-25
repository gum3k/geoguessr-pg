const express = require('express');
const path = require('path');
const routes = require('./routes');
require('dotenv').config(); // For environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Serve React app from the client build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API routes
app.use('/api', routes);

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
