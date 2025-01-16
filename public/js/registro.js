document.getElementById('registroForm').addEventListener('submit', async (e) => {

  const notyf = new Notyf();
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
        const response = await fetch('/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            notyf.error(`Error: ${error.error}`); // Mostrar mensaje de error
            return;
        }

        const result = await response.json();
        notyf.success('Usuario registrado exitosamente.'); // Mostrar mensaje de éxito
        setTimeout(() => {
            window.location.href = '/login'; // Redirigir al inicio de sesión
        }, 2000); // Agregar un pequeño retraso antes de redirigir
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        notyf.error('Error al registrar usuario.');
    }
});