function cargarFormularioPedido() {
	// Constantes
	const HTML = $('html');
	const THEAD_TABLA_PEDIDO = $('#tablaPedido thead');
	const TBODY_TABLA_PEDIDO = $('#tablaPedido tbody');
	const FECHA_INICIO = $('#fechaInicioPedido');
	const FECHA_FIN = $('#fechaFinPedido');
	const HORA_INICIO = $('#horaInicio');
	const HORA_FIN = $('#horaFin');
	const LOCALE = 'es-es';
	const DATE_FORMAT = 'dd/mm/yyyy';

	// Iconos
	const CLASE_ICO_CHECK = 'fa-check-circle';
	const CLASE_ICO_TIMES = 'fa-times-circle';
	const CLASE_ICO_CHECK_Y_TIMES = 'fa-stop-circle';
	const FA_FONT_W = 'far';

	crearPickers();

	$('#btnConsultarPedido').click((e) => {
		e.preventDefault();

		mostrarVentanaConsultarPedido();
	});

	function crearPickers() {
		let fecha = new Date();
		let hoy = `${fecha.getDate()}/${(fecha.getMonth() + 1)}/${fecha.getFullYear()}`; // Fecha de hoy

		FECHA_INICIO.datepicker({
			locale: LOCALE,
			format: DATE_FORMAT,
			weekStartDay: 1,
			showOtherMonths: true,
			footer: false,
			modal: true,
			header: true,
			showOnFocus: true,
			showRightIcon: false,
			value: hoy,
			maxDate: () => {
				return FECHA_FIN.val();
			}
		});

		FECHA_FIN.datepicker({
			locale: LOCALE,
			format: DATE_FORMAT,
			weekStartDay: 1,
			showOtherMonths: true,
			footer: false,
			modal: true,
			header: true,
			showOnFocus: true,
			showRightIcon: false,
			value: hoy,
			minDate: () => {
				return FECHA_INICIO.val();
			},
			maxDate: hoy
		});

		let jsonHora = {
			locale: LOCALE,
			mode: '24hr'
		};

		HORA_FIN.timepicker(jsonHora);
		HORA_INICIO.timepicker(jsonHora);
	}

	function mostrarVentanaConsultarPedido() {
		ocultarTablaFormulario();

		// Obtener datos del formulario
		let fechaInicio = FECHA_INICIO.val();
		let fechaFin = FECHA_FIN.val();
		let horaInicio = HORA_INICIO.val();
		let horaFin = HORA_FIN.val();

		// Formatear fechas
		fechaInicio = formatoFecha(fechaInicio);
		fechaFin = formatoFecha(fechaFin);

		let datos = `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&horaInicio=${horaInicio}&horaFin=${horaFin}`;

		if ($('input[name=opcion]:checked').val() == 'producto') { // Muestra el listado de pedidos
			consultarPedido(); // Consultar pedidos
		} else { // Muestra el total de pedidos
			consultarPedidoTotal(); // Consultar total de pedidos
		}

		function consultarPedido() {
			TBODY_TABLA_PEDIDO.empty(); // Vaciar tabla

			$.post("php/consultarPedido.php", datos,
				(json) => {
					let pedidos = JSON.parse(json.json);

					if (Object.keys(pedidos).length > 0) { // Si hay pedidos
						cargarCabezeraTablaPedidos();

						let fecha;
						
						$.each(pedidos, (npedido, pedido) => { // Recorrer pedidos
							let total = 0; // Total de pedido
							
							$.each(pedido, (_nlinea, lineaPedido) => { // Recorrer lineas de pedido
								agregarFilaLineaPedido(lineaPedido); // Agregar fila de linea de pedido
								fecha = lineaPedido.fecha; // Fecha del pedido
								total += (lineaPedido.precio * lineaPedido.unidades); // Sumar total
							});
							
							agregarFilaTablaPedido(npedido, total, fecha); // Agregar fila de pedido
						});
					} else {
						msg("No hay pedidos en ese rango de fechas", "info");
					}
				},
				"json"
			);
		}

		function consultarPedidoTotal() {
			TBODY_TABLA_PEDIDO.empty(); // Vaciar tabla de pedidos

			$.post("php/consultarPedidoPorDia.php", datos,
				(json) => {
					let pedidos = JSON.parse(json.json); // Pedidos
					if (pedidos.length > 0) { // Si hay pedidos
						cargarCabezeraTablaPedidosTotal(); // Cargar cabezera tabla de pedidos total

						let precioTotal = 0; // Total de pedidos

						$.each(pedidos, (_index, pedido) => { // Recorrer pedidos
							precioTotal = precioTotal + parseFloat(agregarFilaTablaPedidoTotal(pedido)); // Agregar fila a la tabla
						});

						crearUrlBotonImprimir();

						// Agregar fila total
						agregarFilaTotalTablaPedidoTotal(numerosDecimales(precioTotal));
					} else {
						msg("No hay pedidos en ese rango de fechas", "info");
					}
				},
				"json"
			);
		}
	}

	// Dar formato a fecha
	function formatoFecha(fecha) {
		fecha = fecha.split('/');
		fecha = fecha.reverse();
		fecha = fecha.toString();
		fecha = fecha.replace(/,/g, "-");
		return fecha;
	}

	function capitalize(palabra) {
		return palabra[0].toUpperCase() + palabra.slice(1);
	}

	function agregarLineasPedidoTablaPrincipal(npedido) {
		let filaLineaPedido = $(`tr.pedido-${npedido}`);
		let datos = {};
		TBODY.find('tr').remove(); // Borrar filas de tabla

		filaLineaPedido.each((_index, fila) => {
			datos.codigo = $(fila).data('codigo');
			datos.descripcion = $(fila).data('descripcion');
			datos.unidades = $(fila).data('unidades');
			datos.precio = numerosDecimales($(fila).data('precio'));

			agregarFila(datos); // Agregar fila a tabla
		});

		ocultarContenidoFormularios();
	}

	function crearUrlBotonImprimir() {
		let botonImprimir = $('.btn-imprimir');
		botonImprimir.fadeIn(); // Mostrar botón de imprimir
		botonImprimir.removeClass('disabled'); // Habilitar botón de imprimir
		let url = `php/ticketPedidos.php?`; // URL para consultar el ticket de pedido
		let parametros = ''; // Parámetros para consultar el ticket de pedido
		let datos = ''; // Fecha y total de pedidos

		let filas = TBODY_TABLA_PEDIDO.find('tr:not(.table-secondary)'); // Filas de la tabla de pedidos

		filas.each((_index, celda) => { // Recorrer filas de la tabla de pedidos
			let checkbox = $(celda).find('input[type=checkbox]'); // Checkbox de la fila de la tabla de pedidos

			if (checkbox.is(':checked')) { // Si el checkbox está seleccionado
				let fecha = $(celda).find('.col-codigo').data('fecha');
				let total = $(celda).find('.col-precio').text();

				// Agregar fecha y total al principio de la URL
				datos = `&fecha[]=${fecha}&total[]=${formatNumber(total)}`;
				parametros = `${datos}${parametros}`; // Agregar parámetros al URL
			}
		});

		parametros = parametros.slice(1); // Eliminar primer caracter
		url = `${url}${parametros}`; // Agregar parámetros al URL

		botonImprimir.attr('href', url); // Agregar URL al botón de imprimir

		if (botonImprimir.attr('href') == 'php/ticketPedidos.php') { // Si no hay pedidos
			botonImprimir.addClass('disabled'); // Deshabilitar botón de imprimir
		}
	}

	function crearUrlBotonImprimirPedido(npedido) {
		let url = "php/ticket.php?nombre=&telefono=";
		let filaLineaPedido = $(`tr.pedido-${npedido}`);

		filaLineaPedido.each((_index, fila) => {
			let descripcion = $(fila).data('descripcion');
			let unidades = $(fila).data('unidades');
			let precio = $(fila).data('precio');
			let total = precio * unidades;

			url += `&descripcion[]=${descripcion}&unidades[]=${unidades}&precio[]=${precio}&total[]=${total}&`;
		});

		// Borrar último carácter
		url = url.slice(0, -1);
		let ventana = window.open(url, '_blank');
		ventana.print();
	}

	function cargarCabezeraTablaPedidos() {
		let nombresFilas = ['', 'Acciones', 'Fecha', 'Total']; // Nombres cabeceras tabla pedidos

		cabeceraTablaPedidos(nombresFilas); // Cambiar nombres cabeceras tabla pedidos
		crearBotonesTablaPedidos(); // Agregar botones a la tabla
		mostrarTablaFormulario(); // Mostrar tabla de formulario
	}

	function cargarCabezeraTablaPedidosTotal() {
		let nombresFilas = ['Fecha', 'Precio', null, null]; // Nombres cabeceras tabla pedidos total

		cabeceraTablaPedidos(nombresFilas); // Cambiar nombres de cabeceras tabla pedidos total
		crearBotonesTablaPedidosTotal(); // Agregar botones a la tabla
		mostrarTablaFormulario(); // Mostrar tabla de formulario
	}

	function cabeceraTablaPedidos(nombresFilas) {
		let cabeceras = THEAD_TABLA_PEDIDO.find('th');
		cabeceras.show(); // Mostrar todas las cabeceras

		cabeceras.each((index, celda) => {
			if (nombresFilas[index] === null) {
				$(celda).hide(); // Ocultar cabeceras
			} else {
				$(celda).text(nombresFilas[index]).addClass('align-middle'); // Cambiar nombres de cabeceras
			}
		});
	}

	function crearBotonesTablaPedidos() {
		let celda = THEAD_TABLA_PEDIDO.find('th:first-child'); // Primera celda de la tabla

		let input = $("<input>"); // Crear input
		input.attr('type', 'text'); // Agregar atributo type
		input.addClass('form-control'); // Agregar clase
		input.attr({
			placeholder: 'Buscar pedido',
			autocomplete: 'off'
		}); // Agregar placeholder

		input.keyup((e) => {
			TBODY_TABLA_PEDIDO.find("tr.fila-activa").click(); // Desactivar filtro de tabla
			let valorBuscado = $(e.target).val().toLowerCase();
			let npedido;

			TBODY_TABLA_PEDIDO.find("tr.pedido").filter(function() {
				let fila = $(this);
				npedido = fila.data('npedido');

				fila.toggle(fila.text().toLowerCase().indexOf(valorBuscado) > -1);
			});
		});

		$(celda).append(input); // Agregar input a la celda
	}

	function crearBotonesTablaPedidosTotal() {
		let celda = THEAD_TABLA_PEDIDO.find('th:first-child'); // Primera celda de la tabla

		// Crear div para botones
		let btnGroup = $("<div>");
		btnGroup.addClass('btn-group ms-2');

		let boton = $("<button>");
		boton.addClass('btn btn-primary');
		btnGroup.append(boton); // Agregar botón

		let icono = $("<i>");
		icono.addClass(`${FA_FONT_W} ${CLASE_ICO_CHECK} fa-lg icono-check`);
		boton.append(icono); // Agregar icono

		let botonSplit = $("<button>");
		botonSplit.addClass('btn btn-primary dropdown-toggle');
		botonSplit.attr('data-bs-toggle', 'dropdown');
		btnGroup.append(botonSplit); // Agregar botón

		let menu = $("<div>");
		menu.addClass('dropdown-menu');

		let botonSelectAll = $("<a>");
		botonSelectAll.addClass('dropdown-item');
		botonSelectAll.attr('href', '#');
		botonSelectAll.text('Seleccionar todo');

		let iconcoSelectAll = $("<i>");
		iconcoSelectAll.addClass('fas fa-tasks text-primary me-2');
		botonSelectAll.prepend(iconcoSelectAll); // Agregar icono

		menu.append(botonSelectAll); // Agregar botón

		let botonSelectNone = $("<a>");
		botonSelectNone.addClass('dropdown-item');
		botonSelectNone.attr('href', '#');
		botonSelectNone.text('Deseleccionar todo');

		let iconcoSelectNone = $("<i>");
		iconcoSelectNone.addClass('fas fa-list-ul text-danger me-2');
		botonSelectNone.prepend(iconcoSelectNone); // Agregar icono

		menu.append(botonSelectNone); // Agregar botón

		btnGroup.append(menu); // Agregar menu
		celda.append(btnGroup); // Agregar botón a celda

		let botonImprimir = $("<a>"); // Botón de imprimir
		botonImprimir.addClass('btn btn-warning btn-imprimir ms-2');
		botonImprimir.attr('target', '_blank'); // Abrir en pestaña nueva
		botonImprimir.attr('type', 'button');

		let iconoImprimir = $("<i>"); // Icono imprimir
		iconoImprimir.addClass(`fas fa-print`);

		botonImprimir.append(iconoImprimir); // Agregar icono
		celda.append(botonImprimir); // Agregar botón a celda

		botonSelectAll.click(() => {
			let checkboxes = TBODY_TABLA_PEDIDO.find('input[type="checkbox"]'); // Seleccionar checkboxes

			checkboxes.prop('checked', true); // Seleccionar todos los checkboxes
			icono.removeClass(`${CLASE_ICO_TIMES} ${CLASE_ICO_CHECK_Y_TIMES}`); // Cambiar icono
			icono.addClass(CLASE_ICO_CHECK); // Cambiar icono

			crearUrlBotonImprimir(); // Crear url botón imprimir
		});

		botonSelectNone.click(() => {
			let checkboxes = TBODY_TABLA_PEDIDO.find('input[type="checkbox"]'); // Seleccionar checkboxes

			checkboxes.prop('checked', false); // Deseleccionar todos los checkboxes
			icono.removeClass(`${CLASE_ICO_CHECK} ${CLASE_ICO_CHECK_Y_TIMES}`); // Cambiar icono
			icono.addClass(CLASE_ICO_TIMES); // Cambiar icono

			crearUrlBotonImprimir(); // Crear url botón imprimir
		});

		boton.click(() => {
			let checkboxes = TBODY_TABLA_PEDIDO.find('input[type="checkbox"]');
			let checkboxesSeleccionados = checkboxes.filter(':checked');

			// Seleccionar checkboxes no seleccionados
			let checkboxesNoSeleccionados = checkboxes.filter(':not(:checked)');

			checkboxesNoSeleccionados.prop('checked', true); // Seleccionar todos los checkboxes
			checkboxesSeleccionados.prop('checked', false); // Deseleccionar todos los checkboxes

			if (checkboxesSeleccionados.length > 0 && checkboxesNoSeleccionados.length > 0) { // Si hay checkboxes seleccionados y no seleccionados
				icono.removeClass(`${CLASE_ICO_TIMES} ${CLASE_ICO_CHECK}`); // Cambiar icono
				icono.addClass(CLASE_ICO_CHECK_Y_TIMES); // Cambiar icono
			} else if (checkboxesSeleccionados.length == 0) { // Si todos están seleccionados
				icono.removeClass(`${CLASE_ICO_TIMES} ${CLASE_ICO_CHECK_Y_TIMES}`); // Cambiar icono
				icono.addClass(CLASE_ICO_CHECK); // Cambiar icono
			} else { // Si todos están deseleccionados
				icono.removeClass(`${CLASE_ICO_CHECK_Y_TIMES} ${CLASE_ICO_CHECK}`); // Cambiar icono
				icono.addClass(CLASE_ICO_TIMES); // Cambiar icono
			}

			crearUrlBotonImprimir(); // Crear url botón imprimir
		});
	}

	// Filas tabla pedido total
	function agregarFilaTablaPedidoTotal(pedido) {
		let fila = $("<tr>"); // Crear fila
		let total = numerosDecimales(pedido.total); // Dar formato a total
		let fecha = pedido.fecha;

		// Horas
		let horaInicio = HORA_INICIO.val();
		let horaFin = HORA_FIN.val();

		// Primera columna
		let celda = $("<th>");
		celda.attr('scope', 'row').addClass('col-codigo');

		let customControl = $("<div>");
		customControl.addClass('form-check');

		let inputCheckbox = $("<input>");
		inputCheckbox.attr('id', `checkbox-pedido-${pedido.fecha}`); // Agregar id
		inputCheckbox.attr('type', 'checkbox'); // Agregar tipo
		inputCheckbox.attr('checked', true); // Agregar checked
		inputCheckbox.addClass('form-check-input'); // Agregar clase

		inputCheckbox.change(() => {
			let icono = $(".icono-check"); // Seleccionar icono
			// Seleccionar checkboxes seleccionados
			let checkboxes = TBODY_TABLA_PEDIDO.find('input[type="checkbox"]');
			let checkboxesSeleccionados = checkboxes.filter(':checked');

			// Seleccionar checkboxes no seleccionados
			let checkboxesNoSeleccionados = checkboxes.filter(':not(:checked)');

			if (checkboxesSeleccionados.length > 0 && checkboxesNoSeleccionados.length > 0) { // Si hay checkboxes seleccionados y no seleccionados
				icono.removeClass(`${CLASE_ICO_TIMES} ${CLASE_ICO_CHECK}`); // Cambiar icono
				icono.addClass(CLASE_ICO_CHECK_Y_TIMES); // Cambiar icono
			} else if (checkboxesSeleccionados.length == 0) { // Si todos están desseleccionados
				icono.removeClass(`${CLASE_ICO_CHECK_Y_TIMES} ${CLASE_ICO_CHECK}`); // Cambiar icono
				icono.addClass(CLASE_ICO_TIMES); // Cambiar icono
			} else { // Si todos están seleccionados
				icono.removeClass(`${CLASE_ICO_TIMES} ${CLASE_ICO_CHECK_Y_TIMES}`); // Cambiar icono
				icono.addClass(CLASE_ICO_CHECK); // Cambiar icono
			}

			crearUrlBotonImprimir(); // Crear url botón imprimir
		});

		customControl.append(inputCheckbox); // Agregar checkbox a custom control

		let label = $("<label>");
		label.attr('for', `checkbox-pedido-${pedido.fecha}`); // Agregar atributo for
		label.addClass('custom-control-label'); // Agregar clase
		customControl.append(label); // Agregar label a custom control

		let dia = parseInt(fecha.split('/')[0]); // Obtener día
		let mes = parseInt(fecha.split('/')[1]); // Obtener mes
		let anio = fecha.split('/')[2]; // Obtener año

		let date = new Date(anio, mes - 1, dia); // Crear fecha
		let nombreDia = date.toLocaleString('es-ES', { weekday: 'long' }); // Obtener nombre día en español
		let nombreMes = date.toLocaleString('es-ES', { month: 'long' }); // Obtener nombre mes en español

		let fechaCompleta = `${capitalize(nombreDia)}, ${dia} de ${capitalize(nombreMes)} de ${anio}`; // Crear fecha completa

		if (horaInicio != '' && horaFin != '') { // Si hay horas
			label.text(`${fechaCompleta} ${horaInicio} - ${horaFin}`); // Agregar fecha y hora
		} else {
			label.text(`${fechaCompleta}`); // Agregar fecha
		}

		celda.data('fecha', fecha); // Agregar datos fecha

		celda.append(customControl); // Agregar custom control a celda
		fila.append(celda); // Agregar celda a fila

		// Seguna columna
		celda = $('<td>');
		celda.attr('scope', 'row').addClass('col-precio').text(`${numerosDecimalesMostrar(total)} €`);
		fila.append(celda); // Añadir celda a fila

		// Agregar fila a tabla
		TBODY_TABLA_PEDIDO.append(fila);
		return total;
	}

	// Fila final tabla pedido total
	function agregarFilaTotalTablaPedidoTotal(total) {
		// Fila
		let fila = $("<tr>");
		fila.addClass('table-secondary');

		// PRIMERA CELDA
		let celda = $("<th>");
		celda.attr('scope', 'row').text("Total");
		fila.append(celda); // Añadir celda a fila

		// SEGUNDA CELDA
		celda = $('<td>');
		celda.attr('scope', 'row').text(`${numerosDecimalesMostrar(total)} €`);
		fila.append(celda); // Añadir celda a fila

		// Agregar fila a tabla
		TBODY_TABLA_PEDIDO.append(fila);
	}

	// Filas tabla pedido
	function agregarFilaTablaPedido(npedido, total, fecha) {
		let filaPedido = $("<tr>");
		filaPedido.addClass('pedido');
		filaPedido.data('npedido', npedido); // Agregar datos npedido

		// Primera columna
		let celda = $("<td>");
		celda.text(`Pedido nº ${npedido}`);
		filaPedido.append(celda);

		// Segunda columna
		celda = $("<td>");

		let div = $('<div>');
		div.addClass('btn-group');

		// Botón agregar
		let boton = $('<button>');
		let icon = $('<i>');

		icon.addClass('fas fa-cart-arrow-down');
		boton.addClass('btn btn-success').append(icon).click((e) => {
			e.preventDefault();

			agregarLineasPedidoTablaPrincipal(npedido); // Ocultar formularios
		});

		div.append(boton);

		// Botón eliminar
		boton = $('<button>');
		icon = $('<i>');

		icon.addClass('fas fa-trash-alt');
		boton.addClass('btn btn-danger').append(icon).click((e) => {
			e.preventDefault();

			eliminarPedido(npedido, filaPedido);
		});

		div.append(boton);
		celda.append(div);

		// Botón imprimir
		boton = $('<button>');
		icon = $('<i>');

		icon.addClass('fas fa-print');
		boton.addClass('btn btn-warning').append(icon).click((e) => {
			e.preventDefault();

			crearUrlBotonImprimirPedido(npedido);
		});

		div.append(boton);
		celda.append(div);
		filaPedido.append(celda);

		// Tercera columna
		celda = $('<td>');
		celda.text(fecha);
		filaPedido.append(celda);

		// Cuarta columna
		celda = $('<td>');
		celda.text(`${numerosDecimalesMostrar(numerosDecimales(total))} €`);
		filaPedido.append(celda);

		// Mostrar/ocultar fila
		filaPedido.click((e) => { 
			e.preventDefault();

			// Si se pulsa el botón no se marca la fila
			toggleFilaLPedido(e, filaPedido, npedido);
		});

		TBODY_TABLA_PEDIDO.prepend(filaPedido);
	}

	function toggleFilaLPedido(e, filaPedido, npedido) {
		if (e.target.nodeName != "BUTTON" && e.target.nodeName != "I") {
			// Marcar fila seleccionada						
			filaPedido.toggleClass('fila-activa');
			$(`.pedido-${npedido}`).toggle(250);
		}
	}

	// Filas linea de pedido
	function agregarFilaLineaPedido(pedido) {
		// datos pedido
		let npedido = pedido.npedido;
		let nlinea = pedido.nlinea;
		let codigo = pedido.codigo;
		let descripcion = pedido.descripcion;
		let unidades = pedido.unidades;
		let precio = pedido.precio;

		let fila = $("<tr>");
		fila.addClass(`pedido-${npedido}`).hide();

		// Añaadir datos a fila
		fila.data({
			npedido: npedido,
			nlinea: nlinea,
			codigo: codigo,
			descripcion: descripcion,
			unidades: unidades,
			precio: precio,
			total: (unidades * precio)
		});

		// PRIMERA CELDA
		let celda = $("<td>");
		let enlace = $('<a>').text(descripcion).attr({
			'href': '#'
		});

		celda.addClass('col-descripcion').append(enlace);

		fila.append(celda);
		
		// SEGUNDA CELDA
		celda = $('<td>');
		let boton = $('<button>');
		let icon = $('<i>');

		icon.addClass('fas fa-trash-alt');
		boton.addClass('btn btn-danger').append(icon);

		celda.attr('scope', 'row').addClass('col-codigo').append(boton);
		fila.append(celda);

		// TERCERA CELDA
		celda = $('<td>');
		celda.attr('scope', 'row').addClass('col-unidades');

		if (unidades == 1) {
			celda.text(`${unidades} Unidad`);
		} else {
			celda.text(`${unidades} Unidades`);
		}
		fila.append(celda);

		// CUARTA CELDA
		celda = $('<td>');
		celda.attr('scope', 'row').addClass('col-precio').text(`${numerosDecimalesMostrar(numerosDecimales(precio))} €`);
		fila.append(celda);

		// AGREGAR CELDAS
		TBODY_TABLA_PEDIDO.prepend(fila);
	}

	function eliminarPedido(npedido, filaPedido) {
		let datos = `npedido=${npedido}`; // Crear datos

		$.post("php/eliminarPedido.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					filaPedido.remove(); // Eliminar fila
					$(`.pedido-${npedido}`).remove(); // Eliminar lineas pedido

					msg(json.msg, 'azul'); // Mostrar mensaje
				} else {
					alert(json.msg, 'rojo'); // Mostrar mensaje
				}
			},
			"json"
		);
	}
}
