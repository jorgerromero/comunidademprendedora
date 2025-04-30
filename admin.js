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
    // Cargar datos desde el servidor
    fetch('https://comunidademprendedora.es/pending-users.json')
        .then(response => response.json())
        .then(users => {
            const pendingUsersContainer = document.getElementById('pending-users');
            
            // Limpiar el contenedor antes de cargar nuevos usuarios
            pendingUsersContainer.innerHTML = '';
            
            if (users.length === 0) {
                pendingUsersContainer.innerHTML = '<p>No hay solicitudes pendientes de aprobación.</p>';
                return;
            }
            
            users.forEach(user => {
                const userCard = createUserCard(user, true);
                pendingUsersContainer.appendChild(userCard);
            });
        })
        .catch(error => {
            console.error('Error al cargar usuarios pendientes:', error);
            const pendingUsersContainer = document.getElementById('pending-users');
            pendingUsersContainer.innerHTML = '<p>Error al cargar las solicitudes. Por favor, inténtalo de nuevo más tarde.</p>';
        });
}

// Función para cargar usuarios aprobados
function loadApprovedUsers() {
    // Cargar datos desde el servidor
    fetch('https://comunidademprendedora.es/approved-users.json')
        .then(response => response.json())
        .then(users => {
            const approvedUsersContainer = document.getElementById('approved-users');
            
            // Limpiar el contenedor antes de cargar nuevos usuarios
            approvedUsersContainer.innerHTML = '';
            
            if (users.length === 0) {
                approvedUsersContainer.innerHTML = '<p>No hay usuarios aprobados.</p>';
                return;
            }
            
            users.forEach(user => {
                const userCard = createUserCard(user, false);
                approvedUsersContainer.appendChild(userCard);
            });
        })
        .catch(error => {
            console.error('Error al cargar usuarios aprobados:', error);
            const approvedUsersContainer = document.getElementById('approved-users');
            approvedUsersContainer.innerHTML = '<p>Error al cargar los usuarios aprobados. Por favor, inténtalo de nuevo más tarde.</p>';
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
    // Aprobar usuario
    fetch('https://comunidademprendedora.es/approve-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadPendingUsers();
            loadApprovedUsers();
            alert('Usuario aprobado exitosamente!');
        } else {
            alert('Error al aprobar el usuario');
        }
    })
    .catch(error => {
        console.error('Error al aprobar el usuario:', error);
        alert('Error al aprobar el usuario. Por favor, inténtalo de nuevo más tarde.');
    });
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

// Función para rechazar un usuario
function rejectUser(userId) {
    // Rechazar usuario
    fetch('https://comunidademprendedora.es/reject-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadPendingUsers();
            alert('Usuario rechazado exitosamente!');
        } else {
            alert('Error al rechazar el usuario');
        }
    })
    .catch(error => {
        console.error('Error al rechazar el usuario:', error);
        alert('Error al rechazar el usuario. Por favor, inténtalo de nuevo más tarde.');
    });
}

// Función para eliminar un usuario aprobado
function deleteUser(userId) {
    // Eliminar usuario
    fetch('https://comunidademprendedora.es/delete-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadApprovedUsers();
            alert('Usuario eliminado exitosamente!');
        } else {
            alert('Error al eliminar el usuario');
        }
    })
    .catch(error => {
        console.error('Error al eliminar el usuario:', error);
        alert('Error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.');
    });
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}
