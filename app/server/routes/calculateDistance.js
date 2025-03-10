const express = require('express');
const router = express.Router();

const calculateDistance = (loc1, loc2) => {
    const R = 6371; // radius
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // final distatnce
};

// Endpoint API do obliczania dystansu
router.post('/calculate-distance', (req, res) => {
    const { location1, location2 } = req.body;

    if (!location1 || !location2) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
    }

    const distance = calculateDistance(location1, location2);
    res.json({ distance });
});

module.exports = router;
