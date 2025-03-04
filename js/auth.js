// Obtener elementos del DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Manejar el envío del formulario
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Evitar que el formulario se envíe

  const email = emailInput.value;
  const password = passwordInput.value;

  // Iniciar sesión con Firebase
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Redirigir al dashboard
      window.location.href = 'dashboard.html';
    })
    .catch((error) => {
      alert('Error al iniciar sesión: ' + error.message);
    });
});