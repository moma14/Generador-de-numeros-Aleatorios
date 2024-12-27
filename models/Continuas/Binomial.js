const generateBinomial = (n, p, count) => {
    if (p < 0 || p > 1) {
        throw new Error('La probabilidad p debe estar entre 0 y 1.');
    }
    if (n <= 0 || !Number.isInteger(n)) {
        throw new Error('El número de ensayos n debe ser un entero positivo.');
    }
    if (count <= 0 || !Number.isInteger(count)) {
        throw new Error('La cantidad debe ser un número entero positivo.');
    }

    // Generar los números binomiales
    return Array.from({ length: count }, () => {
        let successes = 0;
        for (let i = 0; i < n; i++) {
            if (Math.random() < p) successes++;
        }
        return successes;
    });
};

module.exports = generateBinomial;
