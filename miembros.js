// miembros.js
// Carga dinámica de miembros aprobados desde JSON (compatible con GitHub Pages)

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('miembros-list');
    if (!container) return;
    const searchInput = document.getElementById('miembros-buscar');
    const filterSelect = document.getElementById('miembros-filtrar');

    let usuariosAprobados = [];

    function renderMiembros(miembros) {
        container.innerHTML = "";
        if (!miembros.length) {
            container.innerHTML = "<p>No hay miembros aprobados aún.</p>";
            return;
        }
        miembros.forEach(usuario => {
            const card = document.createElement('div');
            card.className = 'miembro-card';
            card.tabIndex = 0;
            card.style.cursor = 'pointer';
            const imgSrc = usuario.foto ? usuario.foto : 'default-avatar.png';
            card.innerHTML = `
                <img src="${imgSrc}" alt="${usuario.nombre}" class="miembro-avatar">
                <h4>${usuario.nombre}</h4>
                <p>${usuario.objetivos}</p>
                <button class="ver-perfil-btn">Ver perfil</button>
            `;
            card.addEventListener('click', () => mostrarPerfilModal(usuario));
            card.querySelector('.ver-perfil-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                mostrarPerfilModal(usuario);
            });
            container.appendChild(card);
        });
    }

    function actualizarLista() {
        let miembros = usuariosAprobados;
        // Filtro por búsqueda
        const query = (searchInput && searchInput.value.trim().toLowerCase()) || "";
        if (query) {
            miembros = miembros.filter(u =>
                u.nombre.toLowerCase().includes(query) ||
                (u.objetivos && u.objetivos.toLowerCase().includes(query))
            );
        }
        // Filtro por select
        if (filterSelect && filterSelect.value) {
            miembros = miembros.filter(u =>
                u.objetivos && u.objetivos.toLowerCase().includes(filterSelect.value.toLowerCase())
            );
        }
        renderMiembros(miembros);
    }

    if (searchInput) {
        searchInput.addEventListener('input', actualizarLista);
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', actualizarLista);
    }

    // --- Cargar miembros aprobados desde JSON ---
    fetch('approved-users.json')
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar la lista de miembros.');
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                usuariosAprobados = data;
            } else if (data && Array.isArray(data.users)) {
                usuariosAprobados = data.users;
            } else if (data && Array.isArray(data.usuarios)) {
                usuariosAprobados = data.usuarios;
            } else {
                usuariosAprobados = [];
            }
            actualizarLista();
        })
        .catch(() => {
            usuariosAprobados = [];
            actualizarLista();
        });
});

// Modal para mostrar el perfil completo
function mostrarPerfilModal(usuario) {
    let prevModal = document.getElementById('modal-perfil-miembro');
    if (prevModal) prevModal.remove();
    const modal = document.createElement('div');
    modal.id = 'modal-perfil-miembro';
    modal.className = 'modal-miembro';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" tabindex="0" role="button">&times;</span>
            <img src="${usuario.foto ? usuario.foto : 'default-avatar.png'}" alt="${usuario.nombre}" class="miembro-avatar-grande">
            <h2>${usuario.nombre}</h2>
            <p><strong>Objetivos:</strong> ${usuario.objetivos}</p>
            <p><strong>Información:</strong> ${usuario.info}</p>
            <p><strong>Contacto:</strong> ${usuario.contacto}</p>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.querySelector('.close-modal').onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') modal.remove();
    };
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}
