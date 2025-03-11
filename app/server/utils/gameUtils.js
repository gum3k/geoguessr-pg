exports.calculateDistance = (loc1, loc2) => {
    const R = 6371; // Promień Ziemi w km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Zwraca dystans w km
};

exports.calculateScore = (distance) => {
    const e = 2.718281828459045;
    return Math.max(0, Math.round(5000 * e ** (-10 * distance / 20037.852)));
};
