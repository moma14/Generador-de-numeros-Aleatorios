document.addEventListener('DOMContentLoaded', () => {
    const continuousSelect = document.getElementById('continuous-type');
    const continuousParams = document.getElementById('continuous-params');

    const discreteSelect = document.getElementById('discrete-type');
    const discreteParams = document.getElementById('discrete-params');

    // Cambiar dinámicamente los inputs para distribuciones continuas
    continuousSelect.addEventListener('change', () => {
        const selected = continuousSelect.value;

        if (selected === 'uniform') {
            continuousParams.innerHTML = `
                <label for="min-uniform">Mínimo:</label>
                <input id="min-uniform" type="number" step="0.01" />
                <label for="max-uniform">Máximo:</label>
                <input id="max-uniform" type="number" step="0.01" />
                <label for="count-uniform">Cantidad:</label>
                <input id="count-uniform" type="number" min="1" />
            `;
        } else {
            continuousParams.innerHTML = `<p>Próximamente para ${selected}.</p>`;
        }
    });

    // Cambiar dinámicamente los inputs para distribuciones discretas
    discreteSelect.addEventListener('change', () => {
        const selected = discreteSelect.value;

        if (selected === 'bernoulli') {
            discreteParams.innerHTML = `
                <label for="p-bernoulli">Probabilidad de éxito (p):</label>
                <input id="p-bernoulli" type="number" step="0.01" min="0" max="1" placeholder="Ej: 0.7" />
                <label for="count-bernoulli">Cantidad:</label>
                <input id="count-bernoulli" type="number" min="1" placeholder="Ej: 10" />
            `;
        } else {
            discreteParams.innerHTML = `<p>Próximamente para ${selected}.</p>`;
        }
    });

    // Manejo del formulario para Uniforme
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
        }
    });

    // Manejo del formulario para Bernoulli
    document.getElementById('discrete-form').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const type = discreteSelect.value;
        console.log('Tipo de distribución seleccionada:', type);
    
        if (type === 'bernoulli') {
            const p = parseFloat(document.getElementById('p-bernoulli')?.value);
            const count = parseInt(document.getElementById('count-bernoulli')?.value);
    
            console.log('Datos enviados al backend:', { type, params: { p, count } });
    
            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, params: { p, count } }),
                });
    
                console.log('Respuesta del backend (status):', response.status);
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error del servidor:', errorData.error);
                    alert(`Error del servidor: ${errorData.error}`);
                    return;
                }
    
                const data = await response.json();
                console.log('Datos recibidos del backend:', data);
    
                const resultsList = document.getElementById('results-list');
                resultsList.innerHTML = data.results
                    .map((num) => `<li>${num}</li>`)
                    .join('');
            } catch (error) {
                console.error('Error en la solicitud:', error.message);
                alert('Ocurrió un error al generar los números. Inténtalo nuevamente.');
            }
        }
    });
    
    
});
