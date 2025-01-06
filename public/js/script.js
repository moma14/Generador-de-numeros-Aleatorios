document.addEventListener('DOMContentLoaded', () => {
    const continuousSelect = document.getElementById('continuous-type');
    const continuousParams = document.getElementById('continuous-params');
    const discreteSelect = document.getElementById('discrete-type');
    const discreteParams = document.getElementById('discrete-params');
    const resultsList = document.getElementById('results-list');

    // Configuración dinámica de inputs para distribuciones continuas
    continuousSelect.addEventListener('change', () => {
        const selected = continuousSelect.value;

        if (selected === 'uniform') {
            continuousParams.innerHTML = `
                <label for="min-uniform">Mínimo:</label>
                <input id="min-uniform" name="min" type="number" step="0.01" required />
                <label for="max-uniform">Máximo:</label>
                <input id="max-uniform" name="max" type="number" step="0.01" required />
                <label for="count-uniform">Cantidad:</label>
                <input id="count-uniform" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'normal') {
            continuousParams.innerHTML = `
                <label for="mean-normal">Media (\u03bc):</label>
                <input id="mean-normal" name="mean" type="number" step="0.01" required />
                <label for="stddev-normal">Desviación estándar (\u03c3):</label>
                <input id="stddev-normal" name="stddev" type="number" step="0.01" min="0" required />
                <label for="count-normal">Cantidad:</label>
                <input id="count-normal" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'exponential') {
            continuousParams.innerHTML = `
                <label for="lambda-exponential">Lambda (λ):</label>
                <input id="lambda-exponential" name="lambda" type="number" step="0.01" min="0.01" required />
                <label for="count-exponential">Cantidad:</label>
                <input id="count-exponential" name="count" type="number" min="1" required />
            `;
        } else {
            continuousParams.innerHTML = `<p>Distribución seleccionada no soportada.</p>`;
        }
    });

    // Configuración dinámica de inputs para distribuciones discretas
    discreteSelect.addEventListener('change', () => {
        const selected = discreteSelect.value;

        if (selected === 'binomial') {
            discreteParams.innerHTML = `
                <label for="n-binomial">Número de ensayos (n):</label>
                <input id="n-binomial" name="n" type="number" min="1" required />
                <label for="p-binomial">Probabilidad de éxito (p):</label>
                <input id="p-binomial" name="p" type="number" step="0.01" min="0" max="1" required />
                <label for="count-binomial">Cantidad:</label>
                <input id="count-binomial" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'bernoulli') {
            discreteParams.innerHTML = `
                <label for="p-bernoulli">Probabilidad de éxito (p):</label>
                <input id="p-bernoulli" name="p" type="number" step="0.01" min="0" max="1" required />
                <label for="count-bernoulli">Cantidad:</label>
                <input id="count-bernoulli" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'poisson') {
            discreteParams.innerHTML = `
                <label for="lambda-poisson">Lambda (λ):</label>
                <input id="lambda-poisson" name="lambda" type="number" step="0.01" min="0.01" required />
                <label for="count-poisson">Cantidad:</label>
                <input id="count-poisson" name="count" type="number" min="1" required />
            `;
        } else {
            discreteParams.innerHTML = `<p>Distribución seleccionada no soportada.</p>`;
        }
    });

    // Manejo del formulario para distribuciones continuas
    document.getElementById('continuous-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = continuousSelect.value;

        if (type === 'exponential') {
            const lambda = parseFloat(document.getElementById('lambda-exponential')?.value);
            const count = parseInt(document.getElementById('count-exponential')?.value);

            if (!lambda || !count || lambda <= 0 || count <= 0) {
                alert('Parámetros inválidos para distribución exponencial.');
                return;
            }

            try {
                const response = await fetch('/exponential', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lambda, count }),
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                resultsList.innerHTML = data.results
                    .map((num) => `<li>${num.toFixed(2)}</li>`)
                    .join('');
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        } else {
            const params = Object.fromEntries(new FormData(e.target).entries());

            try {
                const response = await fetch('/continuous', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, params }),
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }

                resultsList.innerHTML = data.results
                    .map((num) => `<li>${num.toFixed(2)}</li>`)
                    .join('');
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    });

    // Manejo del formulario para distribuciones discretas
    document.getElementById('discrete-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = discreteSelect.value;
        const params = Object.fromEntries(new FormData(e.target).entries());

        try {
            const response = await fetch('/discrete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, params }),
            });

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            resultsList.innerHTML = data.results
                .map((num) => `<li>${num}</li>`)
                .join('');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
});
