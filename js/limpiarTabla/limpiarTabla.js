function limpiarTabla() {
	TBODY.find('tr:not(tr:last)').remove();
	$('tbody input').val('');
	TBODY.find('td.col-descripcion').text('');

	setTimeout(() => {
		TBODY.find('input:first').focus();
	}, 500);

	reiniciarContador();
}