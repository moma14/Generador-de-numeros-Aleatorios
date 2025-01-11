const generateTriangular = (min, mode, max, count) => {
    return Array.from({ length: count }, () => {
        const u = Math.random();
        if (u < (mode - min) / (max - min)) {
            return min + Math.sqrt(u * (max - min) * (mode - min));
        } else {
            return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
        }
    });
};

module.exports = generateTriangular;
