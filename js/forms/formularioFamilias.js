function cargarFormularioFamilias() {
	const SELECTOR_FAMILIAS = '#familias';
	const SELECT_INSERTAR_FAMILIA = $('#familia'); // Select de familia a insertar
	const SELECT_FAMILIAS_EXISTENTES = $(SELECTOR_FAMILIAS); // Select de familias existentes

	getFamilias(SELECTOR_FAMILIAS); // Cargar datos familias

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
		let optionsSelected = SELECT_FAMILIAS_EXISTENTES.find('option:selected'); // Familias seleccionadas

		if (optionsSelected.length > 0) { // Si hay familias seleccionadas
			msgConfirm('Borrar familia', `¿Está seguro de borrar la familia "${optionsSelected.text()}"?`, (respuesta) => { // Confirmar borrado
				if (respuesta) {
					eliminarFamilia();
				} else {
					msg('Operación cancelada', 'info');
				}
			});
		} else { // No hay familias seleccionadas
			msg('Seleccione una familia', 'warning');
		}
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
					SELECT_FAMILIAS_EXISTENTES.append(option); // Agregar opción a la lista de familias
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
		let optionsSelected = SELECT_FAMILIAS_EXISTENTES.find('option:selected'); // Familias seleccionadas

		optionsSelected.each((_index, element) => { // Recorrer familias seleccionadas
			datos += `familia[]=${element.value}&`; // Agregar familias a eliminar
		});
		
		datos = datos.slice(0, -1); // Eliminar último caracter

		$.post("php/eliminarFamilia.php", datos,
		(json) => {
			if (json.resultado == 'ok') {
				msg(json.msg, 'success');

				optionsSelected.remove(); // Eliminar opciones seleccionadas
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

	valido = validarInputVacio(familia); // Validar campo vacío

	familia.keyup(() => {  // Validar caracteres
		valido = validarInputVacio(familia); // Validar campo vacío
	});

	return valido;
}

//	Cargar datos familias
function getFamilias(selector) {
	$.get("php/getFamilias.php", null,
		(json) => {
			$(selector).empty();

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