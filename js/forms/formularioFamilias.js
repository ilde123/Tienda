function cargarFormularioFamilias() {
	const SELECT_INSERTAR_FAMILIA = $('#familia'); // Select de familia a insertar
	const SELECT_FAMILIAS = $('#familias'); // Select de familias existentes
	const OPTIONS_SELECTED_FAMILIAS = SELECT_FAMILIAS.find('option:selected'); // Familias seleccionadas

	getFamilias('#familias'); // Cargar datos familias

	$('#btnAgregarFamilia').click((e) => { // Botón agregar familia
		e.preventDefault();

		if (validarFormularioFamilias()) { // Validar formulario
			insertarFamilia();
		} else {
			msg('Revise los campos', 'danger');
		}
	});

	$('#btnBorrarFamilia').click((e) => { // Botón borrar familias
		e.preventDefault();

		eliminarFamilia();
	});

	// Insertar familia
	function insertarFamilia() {
		let familia = SELECT_INSERTAR_FAMILIA.val();
		let datos = `familia=${familia}`;

		$.post("php/insertarFamilia.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					msg(json.msg, 'success');

					let option = $('<option>'); // Crear opción
					option.val(familia); // Descripción de la familia
					option.text(familia);
					SELECT_FAMILIAS.append(option); // Agregar opción a la lista de familias
					SELECT_INSERTAR_FAMILIA.val(''); // Limpiar campo de familia
				} else {
					msg(json.msg, 'danger');
				}
			},
			"json"
		);
	}
	// Eliminar familia
	function eliminarFamilia() {
		let datos = "";

		OPTIONS_SELECTED_FAMILIAS.each((_index, element) => { // Recorrer familias seleccionadas
			datos += `familia[]=${element.value}&`; // Agregar familias a eliminar
		});

		datos = datos.substring(0, datos.length - 1); // Eliminar último caracter

		$.post("php/eliminarFamilia.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					msg(json.msg, 'success');

					OPTIONS_SELECTED_FAMILIAS.remove(); // Eliminar opciones seleccionadas
				} else {
					msg(json.msg, 'danger');
				}
			},
			"json"
		);
	}
}

function validarFormularioFamilias() {
	let valido = true;

	// Validar campo familia
	let familia = $('#familia');

	valido = validarInputVacio(familia);

	familia.keyup(() => { 
		valido = validarInputVacio(familia);
	});

	return valido;
}

//	Cargar datos familias
function getFamilias(selector) {
	$.get("php/getFamilias.php", null,
		(json) => {
			$('#familias').empty();

			$.each(json, (_index, element) => {
				let option = $('<option>');
				let familia = element.familia;

				option.val(familia);
				option.text(familia);
				$(selector).append(option);
			});
		},
		"json"
	);
}