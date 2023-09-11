function cargarFormularioExistencias() {
	$('#btnConsultarExistencias').click((e) => {
		e.preventDefault();

		// Mostrar tabla existencias
		$('div.contenido-oculto').slideDown(() => {
			filtro("#filtroTablaExistencias", "#tablaExistencias tbody tr"); // Filtro para la tabla existencias
		});

		// Comprueba si el radioButton está marcado
		if ($('#existenciasTodas:checked').val() == 'todas') { // Si está marcado
			$.get("php/consultarStock.php", null, // Llamada a consultar stock
				(json) => {
					agregarFilasTablaStock(json);
				},
				"json"
			);
		} else { // Si no está marcado
			$.get("php/consultarStockBajoMinimos.php", null, // Llamada a consultar stock bajo mínimos
				(json) => {
					agregarFilasTablaStock(json);
				},
				"json"
			);
		}
	});

	function agregarFilasTablaStock(json) { // Agregar filas a la tabla
		let tbody = $('#tablaExistencias tbody');
		let productos = JSON.parse(json.json);
		tbody.empty();

		$.each(productos, (_index, producto) => {
			let fila = $("<tr>");
			fila.addClass('context-menu-existencias');
			fila.data('producto', productos);
	
			// PRIMERA CELDA
			let celda = $("<th>");
			celda.attr('scope', 'row').addClass(CLASE_CODIGO).text(producto.codigo);
			fila.append(celda);

			// SEGUNDA CELDA
			celda = $('<td>').addClass(CLASE_DESCRIPCION).text(producto.descripcion);
			fila.append(celda);

			// TERCERA CELDA
			celda = $('<td>');
			celda.attr('scope', 'row').addClass(CLASE_EXISTENCIAS).text(producto.stock);

			let stock = parseInt(producto.stock);
			let stock_minimo = parseInt(producto.stock_minimo);

			if (stock <= stock_minimo) {
				celda.addClass('bg-danger');
			} else if (stock <= Math.ceil(percentage(stock_minimo, 25)) + stock_minimo) {
				celda.addClass('bg-warning');
			}

			fila.append(celda);

			// CUARTA CELDA
			celda = $('<td>');
			celda.attr('scope', 'row').addClass(CLASE_MINIMO).text(producto.stock_minimo);
			fila.append(celda);

			if (producto.faltan != null || producto.faltan != undefined) { // Si existe la propiedad faltan
				// QUINTA CELDA
				celda = $('<td>');
				celda.attr('scope', 'row').addClass(CLASE_FALTAN).text(producto.faltan);
				fila.append(celda);
			}

			tbody.append(fila); // Agregar fila a la tabla
		});
	}
}

function percentage(num, per) {
	return (parseFloat(num)/100) * parseFloat(per);
}