const express = require('express');
const path = require('path');
const routes = require('./routes');
const calculateDistance = require('./routes/calculateDistance');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const cors = require('cors');

app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Adres frontendowego Reacta
    methods: ["GET", "POST", "FETCH"],
    allowedHeaders: "*",
    credentials: true
  }
});

// Import and initialize the socket logic
require('./socket')(io);

// Middleware: Parsowanie JSON w ciele żądań
app.use(express.json());

// Serve React app from the client build directory
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API routes
app.use('/api', routes);  // Dodajemy routing, który obsłuży rejestrację i inne API
app.use('/api', calculateDistance); // Nowy endpoint do obliczania dystansu

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

server.listen(5000, () => {
  console.log(`Server running on http://localhost:5000`);
});


