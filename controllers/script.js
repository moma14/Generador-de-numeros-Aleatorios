document.addEventListener('DOMContentLoaded', () => {
    const continuousSelect = document.getElementById('continuous-type');
    const continuousParams = document.getElementById('continuous-params');

    const discreteSelect = document.getElementById('discrete-type');
    const discreteParams = document.getElementById('discrete-params');

    // Cambiar dinámicamente los inputs para distribuciones continuas
    continuousSelect.addEventListener('change', () => {
        const selected = continuousSelect.value;
        console.log('Distribución seleccionada en continuo:', selected);

        if (selected === 'uniform') {
            continuousParams.innerHTML = `
                <label for="min-uniform">Mínimo:</label>
                <input id="min-uniform" type="number" step="0.01" />
                <label for="max-uniform">Máximo:</label>
                <input id="max-uniform" type="number" step="0.01" />
                <label for="count-uniform">Cantidad:</label>
                <input id="count-uniform" type="number" min="1" />
            `;
        } else if (selected === 'normal') {
            continuousParams.innerHTML = `
                <label for="mean-normal">Media (\u03bc):</label>
                <input id="mean-normal" type="number" step="0.01" placeholder="Ej: 0" />
                <label for="stddev-normal">Desviación estándar (\u03c3):</label>
                <input id="stddev-normal" type="number" step="0.01" min="0" placeholder="Ej: 1" />
                <label for="count-normal">Cantidad:</label>
                <input id="count-normal" type="number" min="1" placeholder="Ej: 10" />
            `;
        } else {
            continuousParams.innerHTML = `<p>Próximamente para ${selected}.</p>`;
        }
    });

    // Cambiar dinámicamente los inputs para distribuciones discretas
    discreteSelect.addEventListener('change', () => {
        const selected = discreteSelect.value;
        console.log('Distribución seleccionada en discreto:', selected);

        if (selected === 'bernoulli') {
            discreteParams.innerHTML = `
                <label for="p-bernoulli">Probabilidad de éxito (p):</label>
                <input id="p-bernoulli" type="number" step="0.01" min="0" max="1" placeholder="Ej: 0.7" />
                <label for="count-bernoulli">Cantidad:</label>
                <input id="count-bernoulli" type="number" min="1" placeholder="Ej: 10" />
            `;
        } else if (selected === 'binomial') {
            discreteParams.innerHTML = `
                <label for="n-binomial">Número de ensayos (n):</label>
                <input id="n-binomial" type="number" min="1" placeholder="Ej: 10" />
                <label for="p-binomial">Probabilidad de éxito (p):</label>
                <input id="p-binomial" type="number" step="0.01" min="0" max="1" placeholder="Ej: 0.5" />
                <label for="count-binomial">Cantidad:</label>
                <input id="count-binomial" type="number" min="1" placeholder="Ej: 10" />
            `;
        } else {
            discreteParams.innerHTML = `<p>Próximamente para ${selected}.</p>`;
        }
    });

    // Manejo del formulario para Uniforme y Normal
    document.getElementById('continuous-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const type = continuousSelect.value;

        if (type === 'uniform') {
            const min = parseFloat(document.getElementById('min-uniform')?.value);
            const max = parseFloat(document.getElementById('max-uniform')?.value);
            const count = parseInt(document.getElementById('count-uniform')?.value);

            if (isNaN(min) || isNaN(max) || min >= max) {
                alert('Por favor, ingresa valores válidos para el rango (min < max).');
                return;
            }
            if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
                alert('Por favor, ingresa un valor entero positivo para la cantidad.');
                return;
            }

            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, params: { min, max, count } }),
                });

                const data = await response.json();

                const resultsList = document.getElementById('results-list');
                resultsList.innerHTML = data.results
                    .map((num) => `<li>${num.toFixed(2)}</li>`)
                    .join('');
            } catch (error) {
                console.error('Error al generar números:', error);
                alert('Ocurrió un error al generar los números. Inténtalo nuevamente.');
            }
        } else if (type === 'normal') {
            const mean = parseFloat(document.getElementById('mean-normal')?.value);
            const stddev = parseFloat(document.getElementById('stddev-normal')?.value);
            const count = parseInt(document.getElementById('count-normal')?.value);

            if (isNaN(mean)) {
                alert('Por favor, ingresa un valor válido para la media (\u03bc).');
                return;
            }
            if (isNaN(stddev) || stddev <= 0) {
                alert('Por favor, ingresa un valor válido y positivo para la desviación estándar (\u03c3).');
                return;
            }
            if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
                alert('Por favor, ingresa un valor entero positivo para la cantidad.');
                return;
            }

            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, params: { mean, stddev, count } }),
                });

                const data = await response.json();

                const resultsList = document.getElementById('results-list');
                resultsList.innerHTML = data.results
                    .map((num) => `<li>${num.toFixed(2)}</li>`)
                    .join('');
            } catch (error) {
                console.error('Error al generar números:', error.message);
                alert('Ocurrió un error al generar los números. Inténtalo nuevamente.');
            }
        }
    });

    // Manejo del formulario para Binomial y Bernoulli
    document.getElementById('discrete-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const type = discreteSelect.value;

        if (type === 'bernoulli') {
            const p = parseFloat(document.getElementById('p-bernoulli')?.value);
            const count = parseInt(document.getElementById('count-bernoulli')?.value);

            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, params: { p, count } }),
                });

                const data = await response.json();

                const resultsList = document.getElementById('results-list');
                resultsList.innerHTML = data.results
                    .map((num) => `<li>${num}</li>`)
                    .join('');
            } catch (error) {
                console.error('Error en la solicitud:', error.message);
                alert('Ocurrió un error al generar los números. Inténtalo nuevamente.');
            }
        } else if (type === 'binomial') {
            const n = parseInt(document.getElementById('n-binomial')?.value);
            const p = parseFloat(document.getElementById('p-binomial')?.value);
            const count = parseInt(document.getElementById('count-binomial')?.value);

            console.log('Valores ingresados para Binomial:', { n, p, count });

            if (isNaN(n) || n <= 0 || !Number.isInteger(n)) {
                alert('Por favor, ingresa un número entero positivo para n (número de ensayos).');
                return;
            }
            if (isNaN(p) || p < 0 || p > 1) {
                alert('Por favor, ingresa un valor válido para p (probabilidad entre 0 y 1).');
                return;
            }
            if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
                alert('Por favor, ingresa un valor entero positivo para la cantidad.');
                return;
            }

            try {
                console.log('Enviando datos al backend para Binomial...');
                const response = await fetch('/generate/binomial', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ n, p, count }),
                });

                const data = await response.json();

                const resultsList = document.getElementById('results-list');
                resultsList.innerHTML = data.results
                    .map((num) => `<li>${num}</li>`)
                    .join('');
            } catch (error) {
                console.error('Error al generar números:', error.message);
                alert('Ocurrió un error al generar los números. Inténtalo nuevamente.');
            }
        }
    });
});
