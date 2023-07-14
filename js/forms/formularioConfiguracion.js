function cargarFormularioConfiguracion() {
	if (isEmpty(getItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO))) {
		let valor = formConfiguracion.agregarFila.checked;

		setItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO, valor);
	} else if (getItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO) == "true") {
		formConfiguracion.agregarFila.checked = true;
	} else {
		formConfiguracion.agregarFila.checked = false;
	}
	
	$('#agregarFila').off('change');
	$('#agregarFila').on('change', (e) => {
		e.preventDefault();

		let valor = formConfiguracion.agregarFila.checked;
		setItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO, valor);
	});









	if (isEmpty(getItem(MOSTRAR_FAMILIA_TABLA))) {
		let valor = formConfiguracion.mostrarFamilia.checked;

		setItem(MOSTRAR_FAMILIA_TABLA, valor);
	} else if (getItem(MOSTRAR_FAMILIA_TABLA) == "true") {
		formConfiguracion.mostrarFamilia.checked = true;
	} else {
		formConfiguracion.mostrarFamilia.checked = false;
	}

	$('#mostrarFamilia').off('change');
	$('#mostrarFamilia').on('change', (e) => {
		e.preventDefault();

		let valor = formConfiguracion.mostrarFamilia.checked;
		setItem(MOSTRAR_FAMILIA_TABLA, valor);
	});
}