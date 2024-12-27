function generateBernoulli(p, count) {
    if (p < 0 || p > 1) {
        throw new Error("La probabilidad p debe estar entre 0 y 1");
    }
    if (count <= 0 || !Number.isInteger(count)) {
        throw new Error("La cantidad debe ser un número entero positivo.");
    }
    return Array.from({ length: count }, () => (Math.random() <= p ? 1 : 0));
}

module.exports = generateBernoulli;
