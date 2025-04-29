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

// Función para cargar usuarios pendientes
function loadPendingUsers() {
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const pendingUsersContainer = document.getElementById('pending-users');
    
    // Limpiar el contenedor antes de cargar nuevos usuarios
    pendingUsersContainer.innerHTML = '';
    
    if (pendingUsers.length === 0) {
        pendingUsersContainer.innerHTML = '<p>No hay solicitudes pendientes de aprobación.</p>';
        return;
    }
    
    pendingUsers.forEach(user => {
        const userCard = createUserCard(user, true);
        pendingUsersContainer.appendChild(userCard);
    });
}

// Función para cargar usuarios aprobados
function loadApprovedUsers() {
    const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    const approvedUsersContainer = document.getElementById('approved-users');
    
    // Limpiar el contenedor antes de cargar nuevos usuarios
    approvedUsersContainer.innerHTML = '';
    
    if (approvedUsers.length === 0) {
        approvedUsersContainer.innerHTML = '<p>No hay usuarios aprobados.</p>';
        return;
    }
    
    approvedUsers.forEach(user => {
        const userCard = createUserCard(user, false);
        approvedUsersContainer.appendChild(userCard);
    });
}

// Función para crear una tarjeta de usuario
function createUserCard(user, isPending) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    
    userCard.innerHTML = `
        <img src="${user.foto || 'default-avatar.png'}" alt="${user.nombre}">
        <h4>${user.nombre}</h4>
        <p>${user.objetivos}</p>
        <p><strong>Contacto:</strong> ${user.contacto}</p>
        ${isPending ? `
            <div class="action-buttons">
                <button class="action-button approve-button" onclick="approveUser('${user.id}')">Aprobar</button>
                <button class="action-button reject-button" onclick="rejectUser('${user.id}')">Rechazar</button>
            </div>
        ` : ''}
    `;
    
    return userCard;
}

// Función para aprobar un usuario
function approveUser(userId) {
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    
    const user = pendingUsers.find(u => u.id === userId);
    if (user) {
        // Mover usuario a aprobados
        approvedUsers.push(user);
        // Eliminar de pendientes
        pendingUsers.splice(pendingUsers.indexOf(user), 1);
        
        // Actualizar localStorage
        localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
        localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
        
        // Actualizar la interfaz
        loadPendingUsers();
        loadApprovedUsers();
    }
}

// Función para rechazar un usuario
function rejectUser(userId) {
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const user = pendingUsers.find(u => u.id === userId);
    if (user) {
        // Eliminar usuario de pendientes
        pendingUsers.splice(pendingUsers.indexOf(user), 1);
        
        // Actualizar localStorage
        localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
        
        // Actualizar la interfaz
        loadPendingUsers();
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}
