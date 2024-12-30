const generatePoisson = (lambda, count) => {
    if (lambda <= 0) {
        throw new Error('El parámetro λ (lambda) debe ser mayor que 0.');
    }
    if (count <= 0 || !Number.isInteger(count)) {
        throw new Error('La cantidad debe ser un número entero positivo.');
    }

    const poissonRandom = (lambda) => {
        let L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        return k - 1;
    };

    return Array.from({ length: count }, () => poissonRandom(lambda));
};

module.exports = generatePoisson;
