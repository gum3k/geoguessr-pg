const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { query } = require('./database');
const router = express.Router();
const seedrandom = require('seedrandom');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '1d';

router.use(cookieParser());


// fetch API key
router.get('/apikey', (req, res) => {
  const apiKeyPath = process.env.API_KEY_PATH || path.join(__dirname, '..', '..', 'apikey.txt');

  fs.readFile(apiKeyPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading API key:', err);
      return res.status(500).json({ error: 'Failed to read API key' });
    }
    res.json({ apiKey: data.trim() });
  });
});

// serve all locations as CSV
router.get('/locations', (req, res) => {
  const locationsPath = path.join(__dirname, '..', '..', 'locations', 'locations_sets', 'equally_distributed_world_5mln', 'locations.csv');

  fs.readFile(locationsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading locations:', err);
      return res.status(500).json({ error: 'Failed to read locations file' });
    }
    res.type('text/csv').send(data);
  });
});

// fetch random locations with seed
router.get('/locations/random/:seed', (req, res) => {
  const count = parseInt(req.query.count, 10) || 1;
  const mapName = req.query.mapName || 'equally_distributed_world_5mln';
  const seed = parseInt(req.params.seed, 10);
  const locationsPath = path.join(__dirname, '..', '..', 'locations', 'locations_sets', mapName, 'locations.csv');

  fs.readFile(locationsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading locations:', err);
      return res.status(500).json({ error: 'Failed to read locations file' });
    }

    const rows = data.trim().split('\n').slice(1);
    const randomLocations = [];
    const rng = seedrandom(seed);

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(rng() * rows.length);
      const [lat, lng] = rows[randomIndex].split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        randomLocations.push({ lat, lng });
      }
    }

    res.json(randomLocations);
  });
});

// Register new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser1 = await query('SELECT * FROM users WHERE email = $1', [email]);
    const existingUser2 = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser1.rows.length > 0 || existingUser2.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING userid, username, email',
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];
    return res.status(201).json({
      id: newUser.userid,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.error('Error registering user', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length == 0) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    const user = existingUser.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.userid, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );


    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 dzień
    });

    console.log('Token ustawiony w ciasteczku:', token);

    return res.status(200).json({
      message: 'Login successful',
      user: { id: user.userid, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Error logging in user', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
