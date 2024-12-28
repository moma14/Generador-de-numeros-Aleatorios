const generateNormal = require('../models/Continuas/Normal');

const generateNormalHandler = (req, res) => {
    const { mean, stddev, count } = req.body.params;

    try {
        const results = generateNormal(mean, stddev, count);
        res.json({ success: true, results });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = generateNormalHandler;
