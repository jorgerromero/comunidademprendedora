// menu.js
// Drawer lateral derecho para menú desplegable con overlay

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuDrawer = document.getElementById('menuDrawer');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMenu() {
        menuDrawer.classList.add('active');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
    }
    function closeMenu() {
        menuDrawer.classList.remove('active');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
    }

    if (menuToggle && menuDrawer && menuOverlay) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (menuDrawer.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Cerrar el drawer al hacer click en un enlace
    const menuLinks = menuDrawer ? menuDrawer.querySelectorAll('.menu-links a') : [];
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
