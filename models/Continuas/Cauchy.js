const generateCauchy = (location, scale, count) => {
    return Array.from({ length: count }, () => {
        const u = Math.random();
        return location + scale * Math.tan(Math.PI * (u - 0.5));
    });
};

module.exports = generateCauchy;
