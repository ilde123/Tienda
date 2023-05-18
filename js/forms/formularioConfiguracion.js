function cargarFormularioConfiguracion() {
	if (getItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO) == null) {
		let valor = formConfiguracion.agregarFila.checked;

		setItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO, valor);
	}

	if (getItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO) == "true") {
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
}