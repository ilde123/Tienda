function cargarFormularioCopiaSeguridad() {
	let formFile = $('#formFile');

	$('#btnCrearCopiaSeguridad').click(() => { 
		msg('Archivo descargado', 'primary');
	});

	$('#btnEliminarArchivoRestaurarCopiaSeguridad').click((e) => { 
		e.preventDefault();

		limpiarFormFile();
		msg('Archivo deseleccionado', 'info');
	});

	$('#btnRestaurarCopiaSeguridad').click((e) => { 
		e.preventDefault();

		if (isEmpty(formFile.val())) {
			msg('No ha seleccionado ningún archivo', 'danger');
		} else {
/*
			let file = formFile[0].files[0];
			let fileReader = new FileReader();

			fileReader.readAsText(file); 
			fileReader.onload = function() {
        		consola(fileReader.result);
			};
*/
			msgConfirm('Restaurar copia de seguridad', '¿Está seguro de que desea restaurar la copia de seguridad?', (respuesta) => {
				if (respuesta) {

					limpiarFormFile();
				} else {

				}
			});
		}
	});

	function limpiarFormFile() {
		formFile.val('');
	}
}