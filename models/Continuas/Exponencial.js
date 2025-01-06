const generateExponential = (lambda, count) => {
    if (lambda <= 0 || count <= 0 || !Number.isInteger(count)) {
        throw new Error('Lambda debe ser positivo y count debe ser un entero positivo.');
    }
    return Array.from({ length: count }, () => -Math.log(1 - Math.random()) / lambda);
};

module.exports = generateExponential;
