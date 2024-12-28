const generateNormal = (mean, stddev, count) => {
    if (stddev <= 0) {
        throw new Error('La desviación estándar debe ser un número positivo.');
    }
    if (count <= 0 || !Number.isInteger(count)) {
        throw new Error('La cantidad debe ser un número entero positivo.');
    }

    const generateSingleNormal = () => {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stddev + mean;
    };

    return Array.from({ length: count }, generateSingleNormal);
};

module.exports = generateNormal;
