const generateWeibull = (shape, scale, count) => {
    return Array.from({ length: count }, () => {
        const u = Math.random();
        return scale * Math.pow(-Math.log(1 - u), 1 / shape);
    });
};

module.exports = generateWeibull;