const authenticateKey = (req, res, next) => {
    // Check for key in custom header or Authorization header
    const apiKey = req.headers['x-api-key'] || req.headers.authorization;
    const EXPECTED_KEY = process.env.API_KEY || 'MaoriiSecretKey6';

    if (!apiKey || apiKey !== EXPECTED_KEY) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Valid authentication key missing or invalid.'
        });
    }

    next(); // Key is valid, proceed to the route controller
};

module.exports = authenticateKey;