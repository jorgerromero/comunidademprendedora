// registro.js
// Lógica de registro local para registro.html

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

document.addEventListener('DOMContentLoaded', function() {
    const fotoLabel = document.getElementById('foto-label');
    const fotoInput = document.getElementById('foto');
    const form = document.getElementById('registro-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Deshabilitar el botón y mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const nombre = document.getElementById('nombre').value;
        const objetivos = document.getElementById('objetivos').value;
        const info = document.getElementById('info').value;
        const contacto = document.getElementById('contacto').value;
        const foto = document.getElementById('foto').files[0];

        // Validar campos
        if (!nombre || !objetivos || !info || !contacto) {
            alert('Por favor, complete todos los campos requeridos.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            return;
        }

        // Crear objeto de usuario
        const usuario = {
            id: Date.now(),
            nombre,
            objetivos,
            info,
            contacto,
            foto: foto ? foto.name : null, // Solo guardamos el nombre del archivo
            fechaRegistro: new Date().toISOString(),
            estado: 'pendiente',
            aprobado: false
        };

        // Obtener usuarios pendientes existentes
        // Enviar datos al backend
        fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                email: contacto, // Usamos el campo contacto como email
                password: 'default', // Si no usas password, puedes omitirlo en el backend
                objetivos,
                info,
                foto: foto ? foto.name : null
            })
        })
        .then(async response => {
            // Restaurar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            if (response.ok) {
                form.reset();
                fotoLabel.classList.remove('selected');
                fotoLabel.textContent = 'Añadir foto de perfil';
                let prevMsg = document.querySelector('.registro-success');
                if (prevMsg) prevMsg.remove();
                const successMsg = document.createElement('div');
                successMsg.className = 'registro-success';
                successMsg.innerHTML = `
                    <p>¡Gracias por registrarte! Tu perfil está <b>pendiente de aprobación</b> por parte de un administrador.</p>
                    <p>Te contactaremos a través de ${contacto} cuando tu perfil sea aprobado.</p>
                `;
                form.parentNode.insertBefore(successMsg, form);
            } else {
                const error = await response.json();
                alert('Error al registrar: ' + (error.error || 'Intenta más tarde.'));
            }
        })
        .catch(err => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            alert('Error de red al registrar usuario.');
        });
    });
});

// --- Función de registro legado ---
function registrarEmprendedor(nombre, objetivos, info, contacto, foto) {
    const emprendedores = getEmprendedores();
    emprendedores.push({ nombre, objetivos, info, contacto, foto, baneado: false, aprobado: false });
    setEmprendedores(emprendedores);
    setRegistrado(true);
    setAprobado(false);
    window.location.href = 'index.html';
}
