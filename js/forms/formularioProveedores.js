function cargarFormularioProveedores() {
	const SELECTOR_PROVEEDORES = '#proveedores';
	const SELECT_PROVEEDORES = $(SELECTOR_PROVEEDORES);

	getProveedores(SELECTOR_PROVEEDORES); // Cargar datos proveedores

	$('#btnAgregarProveedorModal').click((e) => { // Botón agregar proveedor
		e.preventDefault();

		if (validarFormularioProveedor()) {
			insertarProveedor();
		} else {
			msg('Revise los campos', 'danger');
		}
	});

	$('#btnBorrarProveedor').click((e) => { // Botón borrar proveedores
		e.preventDefault();

		let optionsSelected = SELECT_PROVEEDORES.find('option:selected');

		if (optionsSelected.length > 0) {
			msgConfirm('Borrar proveedor', '¿Está seguro de borrar el proveedor?', (respuesta) => {
				if (respuesta) {
					borrarProveedor();
				} else {
					msg('Operación cancelada', 'info');
				}
			});
		} else {
			msg('Seleccione un proveedor', 'warning');
		}
	});

	function insertarProveedor() {
		let datos = $('form[name="formModalProveedor"]').serializeArray();

		$.post("php/insertarProveedor.php", datos,
			(json) => {
				if (json.resultado = 'ok') {
					msg(json.msg, 'success');

					let option = $('<option>'); // Crear opción
					option.val(datos[0].value); // Descripción del proveedor
					option.text(datos[0].value);
					SELECT_PROVEEDORES.append(option); // Agregar opción a la lista de proveedores

					limpiarModalProveedor(); // Limpiar formulario
				} else {
					msg(json.msg, 'danger');
				}

				return json;
			},
			"json"
		);
	}

	function borrarProveedor() {
		let datos = "";
		let optionsSelected = SELECT_PROVEEDORES.find('option:selected');

		// Obtener los proveedores seleccionados
		optionsSelected.each((_index, element) => { // Recorrer opciones seleccionadas
			datos += `proveedores[]=${element.value}&`; // Agregar proveedor a la cadena de datos
		});

		datos = datos.slice(0, -1); // Borra el último carácter

		$.post("php/eliminarProveedor.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					optionsSelected.remove(); // Eliminar opciones seleccionadas
					msg(json.msg, 'success');
				} else {
					msg(json.msg, 'danger');
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

function validarDescripcionModalProveedor(descripcion) {
	if (validarInputVacio(descripcion)) { // Comprobar si el proveedor ya existe
		$('#proveedores option').each((_index, element) => {
			if ($(element).text().toLowerCase() == descripcion.val().toLowerCase()) {
				descripcion.next().next().text('El proveedor ya existe'); // Mostrar mensaje de error
				campoNoValido(descripcion); // Rreturn false
			}
		});

		return true;
	} else {
		descripcion.next().next().text('Rellene este campo'); // Mostrar mensaje de error
		return false;
	}
}

function validarFormularioProveedor() {
	let campoValido = true;
	let isValid = true;

	// Validar campo descripción
	let descripcion = $('#descripcionModalProveedor');

	campoValido = validarDescripcionModalProveedor(descripcion);

	if (!campoValido) {
		isValid = false;
	}

	descripcion.keyup(() => {
		campoValido = validarDescripcionModalProveedor(descripcion);

		if (!campoValido) {
			isValid = false;
		}
	});

	// Validar campo dirección
	let direccion = $('#direccionModalProveedor');

	campoValido = validarInputVacio(direccion);

	if (!campoValido) {
		isValid = false;
	}

	direccion.keyup(() => {
		campoValido = validarInputVacio(direccion);

		if (!campoValido) {
			isValid = false;
		}
	});

	// Validar campo teléfono
	let telefono = $('#telefonoModalProveedor');
	let eReg = /^[9|6|7]{1}([\d]{2}[-]*){3}[\d]{2}$/; // Expresión regular

	campoValido = validarInputExReg(telefono, eReg);

	if (!campoValido) {
		isValid = false;
	}

	telefono.keyup(() => {
		campoValido = validarInputExReg(telefono, eReg);

		if (!campoValido) {
			isValid = false;
		}
	});

	return isValid;
}

function getProveedores(selector) {
	$.get("php/getProveedores.php", null,
		(json) => {
			$(selector).empty(); // Vaciar el input select

			$.each(json, (_index, proveedor) => {
				let option = $('<option>');
				option.val(proveedor.descripcion);
				option.text(proveedor.descripcion);
				$(selector).append(option);
			});
		},
		"json"
	);
}