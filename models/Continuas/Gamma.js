const generateGamma = (shape, scale, count) => {
    return Array.from({ length: count }, () => {
        let x = 0;
        for (let i = 0; i < shape; i++) {
            x += -Math.log(Math.random());
        }
        return x * scale;
    });
};

module.exports = generateGamma;
