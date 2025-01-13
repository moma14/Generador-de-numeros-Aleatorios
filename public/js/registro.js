document.getElementById('registroForm').addEventListener('submit', async (e) => {
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
        alert(`Error: ${error.error}`);
        return;
      }
  
      const result = await response.json();
      alert('Usuario registrado exitosamente.');
      window.location.href = '/login'; // Redirigir al inicio de sesión
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      alert('Error al registrar usuario.');
    }
  });
  