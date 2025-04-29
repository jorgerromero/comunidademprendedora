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

// --- Registro: ahora siempre pendiente de aprobación ---
document.getElementById('registro-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const objetivos = document.getElementById('objetivos').value.trim();
    const info = document.getElementById('info').value.trim();
    const contacto = document.getElementById('contacto').value.trim();
    const fotoInput = document.getElementById('foto');
    if(!nombre || !objetivos || !info || !contacto) return;
    if(fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(ev) {
            registrarEmprendedor(nombre, objetivos, info, contacto, ev.target.result);
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        registrarEmprendedor(nombre, objetivos, info, contacto, '');
    }
});

function registrarEmprendedor(nombre, objetivos, info, contacto, foto) {
    const emprendedores = getEmprendedores();
    emprendedores.push({ nombre, objetivos, info, contacto, foto, baneado: false, aprobado: false });
    setEmprendedores(emprendedores);
    setRegistrado(true);
    setAprobado(false);
    window.location.href = 'index.html';
}
