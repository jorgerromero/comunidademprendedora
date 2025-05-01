// Función para alternar el menú desplegable
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    const btnRegistro = document.querySelector('.btn-registro');

    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    if (navbarLinks) navbarLinks.classList.toggle('active');
    if (btnRegistro) btnRegistro.classList.toggle('active');

    // Prevenir múltiples listeners: eliminar primero
    document.removeEventListener('click', closeMenuOnClickOutside);
    setTimeout(() => {
        document.addEventListener('click', closeMenuOnClickOutside);
    }, 0);
}

function closeMenuOnClickOutside(e) {
    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    const btnRegistro = document.querySelector('.btn-registro');
    if (!menu || !menuToggle) return;
    if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        if (navbarLinks) navbarLinks.classList.remove('active');
        if (btnRegistro) btnRegistro.classList.remove('active');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

// Cerrar el menú cuando se haga clic en un enlace
const menuLinks = document.querySelectorAll('.menu-links a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.querySelector('.menu');
        const menuToggle = document.querySelector('.menu-toggle');
        const navbarLinks = document.querySelector('.navbar-links');
        const btnRegistro = document.querySelector('.btn-registro');
        if (menu) menu.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (navbarLinks) navbarLinks.classList.remove('active');
        if (btnRegistro) btnRegistro.classList.remove('active');
        document.removeEventListener('click', closeMenuOnClickOutside);
    });
});
