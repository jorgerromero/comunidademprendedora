// Contraseña del administrador
const ADMIN_PASSWORD = 'JromeroBmartinez001';

// Función para verificar la autenticación
function checkAdminAuth() {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
        // Mostrar modal de inicio de sesión
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-content">
                <h2>Panel de Administración</h2>
                <form id="auth-form">
                    <input type="password" id="password" placeholder="Contraseña" required>
                    <button type="submit">Ingresar</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('auth-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            if (password === ADMIN_PASSWORD) {
                localStorage.setItem('isAdmin', 'true');
                modal.remove();
                loadPendingUsers();
                loadApprovedUsers();
            } else {
                alert('Contraseña incorrecta');
            }
        });
    }
}

// Función para cargar los usuarios pendientes
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    loadPendingUsers();
    loadApprovedUsers();
});

// Función para cargar usuarios pendientes desde el backend
function loadPendingUsers() {
    const pendingUsersContainer = document.getElementById('pending-users');
    pendingUsersContainer.innerHTML = '<p>Cargando...</p>';
    fetch('http://localhost:3001/api/users')
        .then(res => res.json())
        .then(users => {
            // Filtrar usuarios pendientes
            const usuariosPendientes = users.filter(u => u.estado === 'pendiente' || u.aprobado === false);
            pendingUsersContainer.innerHTML = '';
            if (usuariosPendientes.length === 0) {
                pendingUsersContainer.innerHTML = '<p>No hay solicitudes pendientes de aprobación.</p>';
                return;
            }
            usuariosPendientes.forEach(usuario => {
                const userCard = createUserCard(usuario, true);
                pendingUsersContainer.appendChild(userCard);
            });
        })
        .catch(() => {
            pendingUsersContainer.innerHTML = '<p>Error al cargar usuarios pendientes.</p>';
        });
}

// Función para cargar usuarios aprobados desde el backend
function loadApprovedUsers() {
    const approvedUsersContainer = document.getElementById('approved-users');
    approvedUsersContainer.innerHTML = '<p>Cargando...</p>';
    fetch('http://localhost:3001/api/users')
        .then(res => res.json())
        .then(users => {
            // Filtrar usuarios aprobados
            const usuariosAprobados = users.filter(u => u.estado === 'aprobado' || u.aprobado === true);
            approvedUsersContainer.innerHTML = '';
            if (usuariosAprobados.length === 0) {
                approvedUsersContainer.innerHTML = '<p>No hay usuarios aprobados.</p>';
                return;
            }
            usuariosAprobados.forEach(user => {
                const userCard = createUserCard(user, false);
                approvedUsersContainer.appendChild(userCard);
            });
        })
        .catch(() => {
            approvedUsersContainer.innerHTML = '<p>Error al cargar usuarios aprobados.</p>';
        });
}

// Función para crear una tarjeta de usuario
function createUserCard(user, isPending) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    
    let actionButtons = '';
    if (isPending) {
        actionButtons = `
            <div class="action-buttons">
                <button class="action-button approve-button" onclick="approveUser('${user.id}')">Aprobar</button>
                <button class="action-button reject-button" onclick="rejectUser('${user.id}')">Rechazar</button>
            </div>
        `;
    } else {
        actionButtons = `
            <div class="action-buttons">
                <button class="action-button delete-button" onclick="deleteUser('${user.id}')">Eliminar</button>
            </div>
        `;
    }
    
    userCard.innerHTML = `
        <img src="${user.foto || 'default-avatar.png'}" alt="${user.nombre}">
        <h4>${user.nombre}</h4>
        <p>${user.objetivos}</p>
        <p><strong>Contacto:</strong> ${user.contacto}</p>
        ${actionButtons}
    `;
    
    return userCard;
}

// Función para aprobar un usuario
function approveUser(userId) {
    let usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
    let usuariosAprobados = JSON.parse(localStorage.getItem('usuariosAprobados')) || [];
    const userIndex = usuariosPendientes.findIndex(user => String(user.id) === String(userId));
    if (userIndex !== -1) {
        const user = usuariosPendientes.splice(userIndex, 1)[0];
        user.estado = 'aprobado';
        user.aprobado = true;
        usuariosAprobados.push(user);
        localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));
        localStorage.setItem('usuariosAprobados', JSON.stringify(usuariosAprobados));
        loadPendingUsers();
        loadApprovedUsers();
    }
}

function rejectUser(userId) {
    let usuariosPendientes = JSON.parse(localStorage.getItem('usuariosPendientes')) || [];
    let usuariosRechazados = JSON.parse(localStorage.getItem('usuariosRechazados')) || [];
    const userIndex = usuariosPendientes.findIndex(user => user.id == userId);
    if (userIndex !== -1) {
        const user = usuariosPendientes.splice(userIndex, 1)[0];
        user.estado = 'rechazado';
        user.aprobado = false;
        usuariosRechazados.push(user);
        localStorage.setItem('usuariosPendientes', JSON.stringify(usuariosPendientes));
        localStorage.setItem('usuariosRechazados', JSON.stringify(usuariosRechazados));
        loadPendingUsers();
    }
}

// Función para enviar correo
function sendEmail(to, subject, message) {
    // Aquí iría la implementación real del envío de correo
    // Por ahora, mostramos un mensaje de prueba
    console.log(`Enviando correo a ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(`Mensaje: ${message}`);
    
    // En una implementación real, usarías un servicio de correo
    // como SendGrid, Mailgun, o tu propio servidor SMTP
    
    return true; // Simulamos que el correo se envió correctamente
}

// Función para eliminar un usuario aprobado
function deleteUser(userId) {
    let usuariosAprobados = JSON.parse(localStorage.getItem('usuariosAprobados')) || [];
    const index = usuariosAprobados.findIndex(user => user.id == userId);
    if (index !== -1) {
        usuariosAprobados.splice(index, 1);
        localStorage.setItem('usuariosAprobados', JSON.stringify(usuariosAprobados));
        loadApprovedUsers();
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}
