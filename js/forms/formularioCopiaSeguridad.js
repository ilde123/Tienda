function cargarFormularioCopiaSeguridad() {
	$('#btnCrearCopiaSeguridad').click(function (e) { 
		msg('Archivo descargado', 'primary');
	});

	$('#btnEliminarArchivoRestaurarCopiaSeguridad').click(function (e) { 
		e.preventDefault();

		$('#formFile').val('');
		msg('Archivo deseleccionado', 'info');
	});

	$('#btnRestaurarCopiaSeguridad').click(function (e) { 
		e.preventDefault();

		if ($('#formFile').val() == "") {
			msg('No ha seleccionado ningún archivo', 'danger');
		} else {
			msgConfirm('Restaurar copia de seguridad', '¿Está seguro de que desea restaurar la copia de seguridad?', (respuesta) => {
				if (respuesta) {
					
				} else {
					
				}
	
			});
		}
	});
}