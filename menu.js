// Función para alternar el menú desplegable
function toggleMenu() {
    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    const btnRegistro = document.querySelector('.btn-registro');

    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    navbarLinks.classList.toggle('active');
    btnRegistro.classList.toggle('active');

    // Cerrar el menú cuando se haga clic fuera de él
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
            menu.classList.remove('active');
            menuToggle.classList.remove('active');
            navbarLinks.classList.remove('active');
            btnRegistro.classList.remove('active');
        }
    });
}

// Cerrar el menú cuando se haga clic en un enlace
document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.querySelector('.menu');
        const menuToggle = document.querySelector('.menu-toggle');
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});
