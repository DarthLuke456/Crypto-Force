// Importa las funciones necesarias desde Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBm9LKrV2iQhewuSFfw3E9Il79Lva2IwW8",
    authDomain: "crypto-force-456.firebaseapp.com",
    projectId: "crypto-force-456",
    storageBucket: "crypto-force-456.appspot.com",
    messagingSenderId: "909754364846",
    appId: "1:909754364846:web:ea53e8eb6c471e29728e3f",
    measurementId: "G-6LVWZQ6EB5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Cambia entre los formularios de Registro e Inicio de Sesión
function toggleForms() {
    const registerFormContainer = document.querySelector('.register-container');
    const loginFormContainer = document.querySelector('.login-container');

    // Cambia la visibilidad de los formularios
    if (registerFormContainer.style.display === 'none') {
        registerFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    } else {
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    }
}

// Lógica del formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Registro exitoso. ¡Bienvenido a Crypto Force!');
        })
        .catch((error) => {
            alert('Error en el registro: ' + error.message);
        });
});

// Lógica del formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Inicio de sesión exitoso. Bienvenido de nuevo.');
        })
        .catch((error) => {
            alert('Error en el inicio de sesión: ' + error.message);
        });
});

// Lógica para iniciar sesión con Google
document.getElementById('googleLogin').addEventListener('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            alert('Inicio de sesión con Google exitoso. ¡Bienvenido!');
        })
        .catch((error) => {
            alert('Error en el inicio de sesión con Google: ' + error.message);
        });
});

// Lógica para registro con Google
document.getElementById('googleRegister').addEventListener('click', function() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            alert('Registro con Google exitoso. ¡Bienvenido!');
        })
        .catch((error) => {
            alert('Error en el registro con Google: ' + error.message);
        });
});

// Conecta el botón de alternar formularios
document.querySelectorAll('.toggle-form').forEach(button => {
    button.addEventListener('click', toggleForms);
});
