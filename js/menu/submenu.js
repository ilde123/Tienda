$('.dropend a.dropdown-toggle').off('click');
$('.dropend a.dropdown-toggle').on('click', function(e) {
	e.preventDefault();

	$('.dropdown-submenu.show').not($(this).next()).prev().removeClass('rotar') // close all other submenus
	$('.dropdown-submenu.show').not($(this).next()).removeClass('show'); //hide other submenus

	if ($(this).next().hasClass('show')) { // Si el submenu está abierto
		$(this).next().removeClass('show'); // Cerrarlo
		$(this).removeClass('rotar'); // Quitar la rotación
	}
	else { // Si el submenu está cerrado
		$(this).next().addClass('show'); // Abrir submenu
		$(this).addClass('rotar'); // Agregar la rotación
	}

	return false; // Evitar que se abra el menú principal
});

$('a.nav-link.dropdown-toggle').on('focusin', function (e) { // Cuando se hace focus en un link de un submenu
	$('.dropdown-submenu.show').prev().removeClass('rotar') // close all other submenus
	$('.dropdown-submenu.show').removeClass('show'); //hide other submenus

});