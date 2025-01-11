const generateBeta = (alpha, beta, count) => {
    const gammaSample = (a) => {
        let x = 0;
        for (let i = 0; i < a; i++) {
            x += -Math.log(Math.random());
        }
        return x;
    };

    return Array.from({ length: count }, () => {
        const x = gammaSample(alpha);
        const y = gammaSample(beta);
        return x / (x + y);
    });
};

module.exports = generateBeta;
