function cargarFormularioProveedores() {
	const SELECT_PROVEEDORES = $('#proveedores');
	const OPTIONS_SELECTED_PROVEEDORES = SELECT_PROVEEDORES.find('option:selected');

	getProveedores('#proveedores'); // Cargar datos proveedores

	$('#btnAgregarProveedorModal').click((e) => { // Botón agregar proveedor
		e.preventDefault();

		if (validarFormularioProveedor()) {
			insertarProveedor();
		} else {
			msg('Revise los campos', 'rojo');
		}
	});

	$('#btnBorrarProveedor').click((e) => { // Botón borrar proveedores
		e.preventDefault();

		borrarProveedor();
	});

	btnVolver();

	function insertarProveedor() {
		let datos = $('form[name="formModalProveedor"]').serializeArray();

		$.post("php/insertarProveedor.php", datos,
			(json) => {
				if (json.resultado = 'ok') {
					msg(json.msg, 'azul');

					let select = SELECT_PROVEEDORES; // Select de proveedores
					let option = $('<option>'); // Crear opción
					option.val(datos[0].value); // Descripción del proveedor
					option.text(datos[0].value);
					select.append(option); // Agregar opción a la lista de proveedores

					limpiarModalProveedor(); // Limpiar formulario
				} else {
					msg(json.msg, 'rojo');
				}

				return json;
			},
			"json"
		);
	}

	function borrarProveedor() {
		let datos = "";

		// Obtener los proveedores seleccionados
		OPTIONS_SELECTED_PROVEEDORES.each((_index, element) => { // Recorrer opciones seleccionadas
			datos += `proveedores[]=${element.value}&`; // Agregar proveedor a la cadena de datos
		});

		datos = datos.slice(0, -1); // Borra el último carácter

		$.post("php/eliminarProveedor.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					OPTIONS_SELECTED_PROVEEDORES.remove(); // Eliminar opciones seleccionadas
					msg(json.msg, 'azul');
				} else {
					msg(json.msg, 'rojo');
				}
			},
			"json"
		);
	}

	function limpiarModalProveedor() {
		$('#modalProveedor').modal('hide'); // Ocultar modal
		// Limpiar campos
		$('#descripcionModalProveedor').val('').removeClass('is-valid is-invalid');
		$('#direccionModalProveedor').val('').removeClass('is-valid is-invalid');
		$('#telefonoModalProveedor').val('').removeClass('is-valid is-invalid');
	}
}
