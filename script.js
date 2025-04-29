// Futuras funcionalidades dinámicas pueden agregarse aquí

// --- Utilidades ---
function getEmprendedores() {
    return JSON.parse(localStorage.getItem('emprendedores')) || [];
}
function setEmprendedores(lista) {
    localStorage.setItem('emprendedores', JSON.stringify(lista));
}
function isRegistrado() {
    // Solo muestra la zona privada si el usuario está aprobado
    return localStorage.getItem('registrado') === '1' && localStorage.getItem('aprobado') === '1';
}
function setRegistrado(flag) {
    if(flag) localStorage.setItem('registrado', '1');
    else localStorage.removeItem('registrado');
}
function setAprobado(flag) {
    if(flag) localStorage.setItem('aprobado', '1');
    else localStorage.removeItem('aprobado');
}

// --- Renderizado de cards ---
function renderEmprendedores() {
    const lista = getEmprendedores();
    const cont = document.getElementById('emprendedores-lista');
    cont.innerHTML = '';
    const visibles = lista.filter(e => !e.baneado && e.aprobado);
    if(visibles.length === 0) {
        cont.innerHTML = '<p>No hay emprendedores registrados aún.</p>';
        return;
    }
    visibles.forEach(e => {
        const card = document.createElement('div');
        card.className = 'emprendedor-card';
        const img = document.createElement('img');
        img.src = e.foto || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80';
        img.alt = `Foto de ${e.nombre}`;
        card.appendChild(img);
        card.innerHTML += `<strong>${e.nombre}</strong><br><span>${e.objetivos}</span><p>${e.info}</p><span style='font-size:0.97rem;color:#888;'>${e.contacto}</span>`;
        cont.appendChild(card);
    });
}

// --- Mostrar/Ocultar zonas según registro ---
function actualizarVista() {
    const zonaPrivada = document.getElementById('zona-privada');
    const registro = document.getElementById('registro');
    const adminLogin = document.getElementById('admin-login');
    if(isRegistrado()) {
        zonaPrivada.style.display = '';
        if (registro) registro.style.display = 'none';
        renderEmprendedores();
        checkAdminMode();
        if (adminLogin) adminLogin.style.display = '';
    } else if (localStorage.getItem('registrado') === '1') {
        // Usuario registrado pero no aprobado
        zonaPrivada.style.display = 'none';
        if (registro) registro.style.display = 'none';
        document.body.insertAdjacentHTML('afterbegin', '<div id="pendiente-aprobacion" style="background:#fffbe8;color:#b88;padding:1.7rem 1.5rem;text-align:center;font-size:1.2rem;">Tu registro está pendiente de aprobación por el administrador.</div>');
    } else {
        zonaPrivada.style.display = 'none';
        if (registro) registro.style.display = '';
        if (adminLogin) adminLogin.style.display = 'none';
    }
}

// --- Panel de administración protegido por contraseña ---
function mostrarLoginAdmin() {
    document.getElementById('admin-login').style.display = '';
    document.getElementById('admin-panel').style.display = 'none';
}
function mostrarPanelAdmin() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = '';
    renderAdminPanel();
}

// --- Login admin ---
const adminLoginForm = document.getElementById('admin-login-form');
if (adminLoginForm) {
    adminLoginForm.onsubmit = function(e) {
        e.preventDefault();
        const pass = document.getElementById('admin-pass').value;
        const error = document.getElementById('admin-login-error');
        if (pass === 'JromeroBmartinez001!') {
            window.ADMIN_MODE = true;
            mostrarPanelAdmin();
            error.style.display = 'none';
            document.getElementById('admin-pass').value = '';
        } else {
            error.style.display = '';
        }
    };
}

// --- Panel de administración (ver, editar, aprobar, banear) ---
function renderAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    if (!window.ADMIN_MODE) {
        adminPanel.style.display = 'none';
        return;
    }
    adminPanel.style.display = '';
    const lista = getEmprendedores();
    const cont = document.getElementById('admin-lista');
    cont.innerHTML = '';
    lista.forEach((e, idx) => {
        const card = document.createElement('div');
        card.className = 'admin-card' + (e.baneado ? ' baneado' : '');
        const img = document.createElement('img');
        img.src = e.foto || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80';
        img.alt = `Foto de ${e.nombre}`;
        card.appendChild(img);
        // Campos editables
        const nombre = document.createElement('input');
        nombre.type = 'text';
        nombre.value = e.nombre;
        nombre.disabled = !!e.baneado;
        card.appendChild(nombre);
        const objetivos = document.createElement('input');
        objetivos.type = 'text';
        objetivos.value = e.objetivos;
        objetivos.disabled = !!e.baneado;
        card.appendChild(objetivos);
        const info = document.createElement('textarea');
        info.value = e.info;
        info.disabled = !!e.baneado;
        card.appendChild(info);
        const contacto = document.createElement('input');
        contacto.type = 'email';
        contacto.value = e.contacto;
        contacto.disabled = !!e.baneado;
        card.appendChild(contacto);
        // Botones
        if (!e.baneado) {
            if (!e.aprobado) {
                const aprobarBtn = document.createElement('button');
                aprobarBtn.className = 'admin-btn';
                aprobarBtn.textContent = 'Aprobar';
                aprobarBtn.onclick = () => {
                    lista[idx].aprobado = true;
                    setEmprendedores(lista);
                    renderAdminPanel();
                };
                card.appendChild(aprobarBtn);
            }
            const guardarBtn = document.createElement('button');
            guardarBtn.className = 'admin-btn';
            guardarBtn.textContent = 'Guardar';
            guardarBtn.onclick = () => {
                lista[idx].nombre = nombre.value;
                lista[idx].objetivos = objetivos.value;
                lista[idx].info = info.value;
                lista[idx].contacto = contacto.value;
                setEmprendedores(lista);
                renderAdminPanel();
                renderEmprendedores();
            };
            card.appendChild(guardarBtn);
            const banBtn = document.createElement('button');
            banBtn.className = 'admin-btn';
            banBtn.textContent = 'Banear';
            banBtn.onclick = () => {
                lista[idx].baneado = true;
                setEmprendedores(lista);
                renderAdminPanel();
                renderEmprendedores();
            };
            card.appendChild(banBtn);
        } else {
            const desbanBtn = document.createElement('button');
            desbanBtn.className = 'admin-btn';
            desbanBtn.textContent = 'Desbanear';
            desbanBtn.onclick = () => {
                lista[idx].baneado = false;
                setEmprendedores(lista);
                renderAdminPanel();
                renderEmprendedores();
            };
            card.appendChild(desbanBtn);
        }
        cont.appendChild(card);
    });
}

function checkAdminMode() {
    if (window.ADMIN_MODE) {
        mostrarPanelAdmin();
    } else {
        mostrarLoginAdmin();
    }
}

// --- Registro ---
document.getElementById('registro-form') && document.getElementById('registro-form').addEventListener('submit', function(e) {
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

// --- Logout ---
document.getElementById('logout-btn') && document.getElementById('logout-btn').addEventListener('click', function() {
    setRegistrado(false);
    setAprobado(false);
    actualizarVista();
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', actualizarVista);

// --- Exponer función para activar el panel admin desde consola (deprecated, ahora solo por login) ---
window.activarPanelAdmin = function() {
    window.ADMIN_MODE = true;
    mostrarPanelAdmin();
};
window.desactivarPanelAdmin = function() {
    window.ADMIN_MODE = false;
    mostrarLoginAdmin();
};
