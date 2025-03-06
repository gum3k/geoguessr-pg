const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const seedrandom = require('seedrandom');

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

module.exports = router;