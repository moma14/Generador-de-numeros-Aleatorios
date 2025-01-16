document.addEventListener('DOMContentLoaded', () => {

    const notyf = new Notyf();
    
    const continuousSelect = document.getElementById('continuous-type');
    const continuousParams = document.getElementById('continuous-params');
    const discreteSelect = document.getElementById('discrete-type');
    const discreteParams = document.getElementById('discrete-params');
    const resultsList = document.getElementById('results-list');
    const chartContainer = document.getElementById('chart-container');
    const canvas = document.getElementById('distribution-chart');
    const downloadButton = document.getElementById('download-button'); // Botón de descarga
    let chart; // Variable para almacenar el gráfico
    const userId = document.body.dataset.userId || null; // Recuperar el userId desde el atributo data-user-id de body
    const authButton = document.querySelector('.auth-button');  

    console.log('userId en el cliente:', document.body.dataset.userId);    
    if (userId && userId !== '') {
        // Si hay un usuario logueado, mostrar "Logout"
        authButton.textContent = 'Logout';
        authButton.href = '/logout'; // Ruta para cerrar sesión
        authButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout', { method: 'POST' });
                if (response.ok) {
                    window.location.reload(); // Recargar para regresar al estado de no autenticado
                } else {
                    console.error('Error al cerrar sesión');
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    } else {
        // Si no hay sesión, mantener "Login"
        authButton.textContent = 'Login';
        authButton.href = '/login';
    }

 // Función para generar un archivo de texto (.txt)
const generateDownloadableFile = (data, type) => {
    let content = '';

    // Crear contenido del archivo en formato texto plano
    content += data.map((value) => `${value}`).join('\n');

    // Crear un Blob con el contenido
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Mostrar el botón de descarga
    downloadButton.style.display = 'block';
    downloadButton.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultados_${type}.txt`; // Nombre del archivo con extensión .txt
        a.click();
        URL.revokeObjectURL(url); // Liberar memoria después de la descarga
    };
};

// Función para renderizar un gráfico con Chart.js
const renderChart = (data, type) => {
    const createHistogramBins = (data, numBins = 10) => {
        if (data.length === 0) return { bins: [], labels: [] };

        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / numBins;
        const bins = Array(numBins).fill(0);
        const labels = [];

        for (let i = 0; i < numBins; i++) {
            labels.push(`${(min + i * binWidth).toFixed(2)} - ${(min + (i + 1) * binWidth).toFixed(2)}`);
        }

        data.forEach((value) => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
            bins[binIndex]++;
        });

        return { bins, labels };
    };

    if (chart) {
        chart.destroy();
    }

    const { bins, labels } = type === 'discrete' ? { bins: data, labels: data.map((_, i) => i + 1) } : createHistogramBins(data);

    chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: type === 'discrete' ? 'Distribución Discreta' : 'Histograma',
                    data: bins,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            animation: {
                onComplete: () => {
                    console.log('Gráfico renderizado completamente.');
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: type === 'discrete' ? 'Índice' : 'Intervalos',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frecuencia',
                    },
                    beginAtZero: true,
                },
            },
        },
    });

    chartContainer.style.display = 'block';
};

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
        } else if (selected === 'gamma') {
            continuousParams.innerHTML = `
                <label for="shape-gamma">Forma (α):</label>
                <input id="shape-gamma" name="shape" type="number" step="0.01" min="0.01" required />
                <label for="scale-gamma">Escala (β):</label>
                <input id="scale-gamma" name="scale" type="number" step="0.01" min="0.01" required />
                <label for="count-gamma">Cantidad:</label>
                <input id="count-gamma" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'beta') {
            continuousParams.innerHTML = `
                <label for="alpha-beta">α:</label>
                <input id="alpha-beta" name="alpha" type="number" step="0.01" min="0.01" required />
                <label for="beta-beta">β:</label>
                <input id="beta-beta" name="beta" type="number" step="0.01" min="0.01" required />
                <label for="count-beta">Cantidad:</label>
                <input id="count-beta" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'log-normal') {
            continuousParams.innerHTML = `
                <label for="mean-lognormal">Media logarítmica:</label>
                <input id="mean-lognormal" name="mean" type="number" step="0.01" required />
                <label for="stddev-lognormal">Desviación estándar logarítmica:</label>
                <input id="stddev-lognormal" name="stddev" type="number" step="0.01" min="0" required />
                <label for="count-lognormal">Cantidad:</label>
                <input id="count-lognormal" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'weibull') {
            continuousParams.innerHTML = `
                <label for="shape-weibull">Forma (k):</label>
                <input id="shape-weibull" name="shape" type="number" step="0.01" min="0.01" required />
                <label for="scale-weibull">Escala (λ):</label>
                <input id="scale-weibull" name="scale" type="number" step="0.01" min="0.01" required />
                <label for="count-weibull">Cantidad:</label>
                <input id="count-weibull" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'cauchy') {
            continuousParams.innerHTML = `
                <label for="location-cauchy">Ubicación (x₀):</label>
                <input id="location-cauchy" name="location" type="number" step="0.01" required />
                <label for="scale-cauchy">Escala (γ):</label>
                <input id="scale-cauchy" name="scale" type="number" step="0.01" min="0.01" required />
                <label for="count-cauchy">Cantidad:</label>
                <input id="count-cauchy" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'triangular') {
            continuousParams.innerHTML = `
                <label for="min-triangular">Mínimo:</label>
                <input id="min-triangular" name="min" type="number" step="0.01" required />
                <label for="mode-triangular">Moda:</label>
                <input id="mode-triangular" name="mode" type="number" step="0.01" required />
                <label for="max-triangular">Máximo:</label>
                <input id="max-triangular" name="max" type="number" step="0.01" required />
                <label for="count-triangular">Cantidad:</label>
                <input id="count-triangular" name="count" type="number" min="1" required />
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
        } else if (selected === 'geometric') {
            discreteParams.innerHTML = `
                <label for="p-geometric">Probabilidad de éxito (p):</label>
                <input id="p-geometric" name="p" type="number" step="0.01" min="0" max="1" required />
                <label for="count-geometric">Cantidad:</label>
                <input id="count-geometric" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'hypergeometric') {
            discreteParams.innerHTML = `
                <label for="population-hypergeometric">Tamaño de la población:</label>
                <input id="population-hypergeometric" name="population" type="number" min="1" required />
                <label for="successes-hypergeometric">Número de éxitos en la población:</label>
                <input id="successes-hypergeometric" name="successes" type="number" min="0" required />
                <label for="samples-hypergeometric">Tamaño de la muestra:</label>
                <input id="samples-hypergeometric" name="samples" type="number" min="1" required />
                <label for="count-hypergeometric">Cantidad:</label>
                <input id="count-hypergeometric" name="count" type="number" min="1" required />
            `;
        } else if (selected === 'multinomial') {
            discreteParams.innerHTML = `
                <label for="n-multinomial">Número de ensayos (n):</label>
                <input id="n-multinomial" name="n" type="number" min="1" required />
                <label for="probs-multinomial">Probabilidades (separadas por comas):</label>
                <input id="probs-multinomial" name="probs" type="text" placeholder="e.g., 0.2,0.3,0.5" required />
                <label for="count-multinomial">Cantidad:</label>
                <input id="count-multinomial" name="count" type="number" min="1" required />
            `;
        } else {
            discreteParams.innerHTML = `<p>Distribución seleccionada no soportada.</p>`;
        }
    });

    const sendToAPI = async (type, params, results) => {
        try {
            const formData = new FormData();
    
            formData.append('distribucion', type);
            formData.append('parametros', JSON.stringify(params));
            formData.append('resultados', JSON.stringify(results));
    
            if (userId) {
                formData.append('id_usuario', userId);
            } else {
                formData.append('id_usuario', null);
            }
    
            if (canvas) {
                console.log('Esperando que el gráfico termine de renderizar...');
                await new Promise((resolve) => setTimeout(resolve, 500)); // Espera 500 ms
    
                console.log('Capturando imagen del canvas...');
                const dataURL = canvas.toDataURL('image/jpeg', 0.8); // Genera la imagen en formato JPEG
                const blob = dataURLToBlob(dataURL);
    
                if (blob) {
                    formData.append('grafica', blob, 'grafico.jpg');
                    console.log('Imagen capturada y agregada al FormData.');
                } else {
                    console.warn('No se pudo convertir el canvas en un Blob.');
                }
            } else {
                console.warn('Canvas no disponible, no se enviará el gráfico.');
            }
    
            console.log('Enviando datos a la API...');
            const response = await fetch('http://localhost:3002/generador/crear', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error al guardar en la base de datos:', errorMessage);
                throw new Error(`Error al guardar en la base de datos: ${response.status} - ${errorMessage}`);
            }
    
            console.log('Generación guardada exitosamente en la base de datos.');
        } catch (error) {
            console.error('Error al guardar en la base de datos:', error.message);
        }
    };    
    
    // Helper: Convertir dataURL a Blob
    const dataURLToBlob = (dataURL) => {
        const parts = dataURL.split(',');
        const mime = parts[0].match(/:(.*?);/)[1];
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };
    
    // Manejo del formulario para distribuciones continuas
    document.getElementById('continuous-form').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const type = continuousSelect.value;
        const formData = new FormData(e.target);
        const params = Object.fromEntries(formData.entries());
    
        // Elimina cualquier campo redundante
        delete params.type;
    
        // Valida y convierte parámetros numéricos
        const numericParams = {};
        for (const key in params) {
            const parsedValue = parseFloat(params[key]);
            if (isNaN(parsedValue)) {
                console.error(`Error: El parámetro "${key}" tiene un valor inválido: ${params[key]}`);
                notyf.error(`El parámetro "${key}" debe ser un número.`); // Mostrar notificación de error
                return;
            }
            numericParams[key] = parsedValue;
        }
    
        // Construye el payload
        const payload = { type, params: numericParams };
        console.log('Payload enviado:', JSON.stringify(payload, null, 2));
    
        try {
            const response = await fetch('/continuous', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error en la respuesta del servidor: ${response.status} - ${errorMessage}`);
            }
    
            const data = await response.json();
            console.log('Respuesta recibida:', data);
    
            if (data.error) {
                throw new Error(data.error);
            }
    
            resultsList.innerHTML = data.results
                .map((num) => `<li>${num.toFixed(2)}</li>`)
                .join('');

                // Renderizar el gráfico con los datos
            renderChart(data.results);
            generateDownloadableFile(data.results, type); // Crear archivo para descarga

            // Enviar los resultados a la API
        await sendToAPI(type, numericParams, data.results);
        } catch (error) {
            console.error('Error durante la solicitud:', error);
            notyf.error(`Error: ${error.message}`); // Mostrar notificación de error
        }
    });
    
    // Manejo del formulario para distribuciones discretas
    document.getElementById('discrete-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = discreteSelect.value;
    
        // Recoge los datos del formulario
        const formData = new FormData(e.target);
        const params = Object.fromEntries(formData.entries());
    
        // Elimina cualquier campo redundante
        delete params.type;
    
        // Convierte los valores de los parámetros a números
        for (const key in params) {
            params[key] = isNaN(params[key]) ? params[key] : parseFloat(params[key]);
        }
    
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

                // Renderizar el gráfico con los datos
        renderChart(data.results, 'discrete');
        generateDownloadableFile(data.results, type); // Crear archivo para descarga

        // Enviar los resultados a la API
        await sendToAPI(type, params, data.results);
        } catch (error) {
            notyf.error(`Error: ${error.message}`); // Mostrar notificación de error
        }
    });    
});
