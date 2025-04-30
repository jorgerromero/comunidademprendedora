// registro.js
// Lógica de registro para registro.html, compatible con index.html

// --- Utilidades compartidas con script.js ---
function getEmprendedores() {
    return JSON.parse(localStorage.getItem('emprendedores')) || [];
}
function setEmprendedores(lista) {
    localStorage.setItem('emprendedores', JSON.stringify(lista));
}
function setRegistrado(flag) {
    if(flag) localStorage.setItem('registrado', '1');
    else localStorage.removeItem('registrado');
}
function setAprobado(flag) {
    if(flag) localStorage.setItem('aprobado', '1');
    else localStorage.removeItem('aprobado');
}

// --- Inicialización ---
const fotoLabel = document.getElementById('foto-label');
const fotoInput = document.getElementById('foto');

// --- Registro: ahora siempre pendiente de aprobación ---

// --- Registro: ahora siempre pendiente de aprobación ---
document.getElementById('registro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const objetivos = document.getElementById('objetivos').value;
    const info = document.getElementById('info').value;
    const contacto = document.getElementById('contacto').value;
    const foto = document.getElementById('foto').files[0];

    // Validar campos
    if (!nombre || !objetivos || !info || !contacto) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }

    // Crear formulario de datos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('objetivos', objetivos);
    formData.append('info', info);
    formData.append('contacto', contacto);
    if (foto) {
        formData.append('foto', foto);
    }

    // Enviar datos al servidor
    fetch('https://comunidademprendedora.es/register', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en el servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Limpiar formulario
            const form = document.getElementById('registro-form');
            form.reset();
            fotoLabel.classList.remove('selected');
            fotoLabel.textContent = 'Añadir foto de perfil';
            
            alert('Gracias por registrarte! Tu perfil será revisado por un administrador.');
            window.location.href = 'index.html';
        } else {
            alert('Error al registrar el usuario. Por favor, inténtalo de nuevo más tarde.');
            console.log('Respuesta del servidor:', data);
        }
    })
    .catch(error => {
        console.error('Error al registrar el usuario:', error);
        alert('Error al registrar el usuario. Por favor, inténtalo de nuevo más tarde.');
    });
});

function registrarEmprendedor(nombre, objetivos, info, contacto, foto) {
    const emprendedores = getEmprendedores();
    emprendedores.push({ nombre, objetivos, info, contacto, foto, baneado: false, aprobado: false });
    setEmprendedores(emprendedores);
    setRegistrado(true);
    setAprobado(false);
    window.location.href = 'index.html';
}
