$('.dropdown-menu a.dropdown-toggle').off('click');
$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
  if (!$(this).next().hasClass('show')) {
	   $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
	   $(this).removeClass('rotar');
  }
  else {
//	   $(this).removeClass('rotar');
  }
  var $subMenu = $(this).next('.dropdown-menu');
  $subMenu.toggleClass('show');
  $(this).toggleClass('rotar');

  var a = $(this);
  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
	$('.dropdown-submenu .show').removeClass('show');
	a.removeClass('rotar');
  });


  return false;
});