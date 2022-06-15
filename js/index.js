var contador = 1;
const HTML = $('html');
const BODY = $('body');

const TABLA = $('#tabla');
const THEAD = TABLA.find('thead');
const TBODY = TABLA.find('tbody:first');
const TOTAL = $('#total');

// Clases de las columnas
const CLASE_CODIGO = 'col-codigo';
const CLASE_DESCRIPCION = 'col-descripcion';
const CLASE_PRECIO = 'col-precio';
const CLASE_UNIDADES = 'col-unidades';
const CLASE_EXISTENCIAS = 'col-existencias';
const CLASE_MINIMO = 'col-minimo';
const CLASE_FALTAN = 'col-faltan';

const NOMBRE_CLIENTE_MODAL_CAMBIO = $('#nombreClienteModalCambio');
const COLLAPSE_NOMBRE_CLIENTE_MODAL_CAMBIO = $('#collapseNombreClienteModalCambio');

const BOTON_TO_TOP = $('#toTop');
const BOTON_AGREGAR_FILA = $('#btnAddRow');
const BOTON_ACEPTAR_PEDIDO = $('#btnAceptarPedido');
const BOTON_CANCELAR_PEDIDO = $('#btnCancelarPedido');

$(function () {
	// $('#qrCanvas').WebCodeCam();

	// Eventos de teclado
	eventoCeldas();
	limpiarTabla();

	// Cargar menu contextual
	$.getScript("js/contextmenu/menuContextual.js");

	// Script para el menu
	$.getScript("js/menu/menu.js");

	// Script modalCambio
	$.getScript("js/modalCambio/modalCambio.js");

	// Navegación entre celdas
	tablaNavegable();

	$('#btnAceptarTicket').click((e) => {
		e.preventDefault();

		imprimirTicket();
	});

	BOTON_CANCELAR_PEDIDO.click((e) => {
		e.preventDefault();

		// Elimina todas las filas menos la primera
		TBODY.children("tr:not(tr:first)").remove();
		// Resetea los valores de los campos
		TBODY.find("tr:first input").val('');
		TBODY.find(`tr:first td.${CLASE_DESCRIPCION}`).text('');
		// Asigna el foco al campo código
		TBODY.find("th input").select();

		actualizarTotal();
		reiniciarContador();
	});

	// borrarLoader
	borrarLoader();

	// Botón toTop
	botonToTop();

	// Botón agregar fila en formato móvil
	BOTON_AGREGAR_FILA.click((e) => { 
		e.preventDefault();

		agregarFila();
	});

	function botonToTop() {
		BOTON_TO_TOP.click((e) => {
			e.preventDefault();

			HTML.animate({
				scrollTop: 0
			}, 800);
		});

		$(window).scroll(() => {
			if (BODY.scrollTop() > 20 || HTML.scrollTop() > 20) {
				BOTON_TO_TOP.fadeIn(250, () => { // Mostrar botón
					BOTON_AGREGAR_FILA.animate({ right: '4em' }); // Mover botón
				});
			} else {
				BOTON_TO_TOP.fadeOut(250, () => { // Ocultar botón
					BOTON_AGREGAR_FILA.animate({ right: '1em' }); // Mover botón
				});
			}
		});
	}

	function borrarLoader() {
		BODY.removeClass('overflow-hidden');
		$('#loader').remove();
	}
});

function msgConfirm(titulo, mensaje, callback) {
	bootbox.confirm({
		title: titulo,
		message: mensaje,
		swapButtonOrder: true,
		closeButton: false,
		buttons: {
			confirm: {
				label: '<i class="fa fa-check"></i>',
				className: 'btn-success'
			},
			cancel: {
				label: '<i class="fa fa-times"></i>',
				className: 'btn-danger'
			}
		},
		callback: callback
		
	});
}

function tablaNavegable() {
	TBODY.keydown((e) => {
		switch (e.keyCode) {
			case 40: // Flecha abajo
				let filaActual = $('input:focus').parents('tr');
				let ultimaFila = TBODY.find('tr:last');

				// Comprueba si la fila actual es la última
				if (filaActual.is(ultimaFila)) {
					agregarFila();

					// Situar foco en el campo código
					TBODY.find('tr:last input:first').focus();
				}

				// Posicionarse en la celda de abajo
				navegarCeldaVertical('abajo');
				break;

			case 39: // Flecha derecha
				navegarCeldaHorizontal('derecha', e.target);
				break;

			case 38: // Flecha arriba
				// Comprueba si existe más de una fila
				if (TBODY.find('tr').length > 1) {
					// COMPRUEBA LAS FILAS VACIAS
					if (TBODY.find('tr:last input').val() == "") {
						eliminarFila();
					} else {
						// Posicionarse en la celda de arriba
						navegarCeldaVertical('arriba');
					}
				}
				break;

			case 37: // Flecha izquierda
				navegarCeldaHorizontal('izquierda', e.target);
				break;
		}

		cerrarListaAutocomplete();
	});

	BODY.keydown((e) => { 
		switch (e.keyCode) {
			case 45: // Botón insertar pulsado 
				BOTON_ACEPTAR_PEDIDO.click();
				break;

			case 27: // Botón escape pulsado
				BOTON_CANCELAR_PEDIDO.click();
				break;
		}
	});
}

function navegarCeldaVertical(direccion) {
	let filaActual = $('input:focus').parents('tr');
	let celdaActual = $('input:focus').parent();
	let celdaAux;
	let clase = celdaActual.attr('class');

	if (direccion == 'arriba') { // Navegar a celda de arriba
		celdaAux = filaActual.prev().find(`.${clase}`);
	} else { // Navegar a celda de abajo
		celdaAux = filaActual.next().find(`.${clase}`);
	}

	// Asignar foco
	setTimeout(() => {
		celdaAux.find('input').focus().select();
	}, 10);
}

function navegarCeldaHorizontal(direccion, input) {
	let i;
	let inputs = TBODY.find('input');

	// Busca index del elemento
	inputs.each((index, element) => {
		if ($(element).is(input)) {
			i = parseInt(index);
		}
	});

	if (direccion == 'derecha') { // Navegar a siguiente celda
		i++;

		if (i == inputs.length) {
			i = 0;
		}
	} else { // Navegar a celda anterior
		i = i - 1;

		if (i == -1) {
			i = inputs.length - 1;
		}
	}

	// Asignar foco a la celda
	inputs.get(i).focus();
	setTimeout(() => {
		inputs.get(i).select();
	}, 10);
}

function agregarFila(datos) {
	contador++;
	let fila = $("<tr>");
	fila.addClass('context-menu-one');

	// Primera celda
	let celdaCodigo = $("<th>");
	celdaCodigo.attr('scope', 'row').addClass(CLASE_CODIGO);
	// Input código
	let inputCodigo = $('<input>');
	inputCodigo.attr({
		type: 'text',
		autocomplete: 'off'
	}).addClass('form-control');
	celdaCodigo.append(inputCodigo);
	celdaCodigo.focus();


	// Añadir celda a la fila
	fila.append(celdaCodigo);

	// Segunda celda
	let celdaDescripcion = $('<td>');
	celdaDescripcion.addClass(CLASE_DESCRIPCION);
	
	// Añadir celda a la fila
	fila.append(celdaDescripcion);

	// Tercera celda
	let celdaUnidades = $('<td>');
	celdaUnidades.addClass(CLASE_UNIDADES);
	// Input unidades
	let inputUnidades = $('<input>');
	inputUnidades.attr({type: 'text'}).addClass('form-control');
	celdaUnidades.append(inputUnidades);

	// Añadir celda a la fila
	fila.append(celdaUnidades);

	// Cuarta celda
	let celdaPrecio = $('<td>');
	celdaPrecio.addClass(CLASE_PRECIO);
	// Input precio
	let inputPrecio = $('<input>');
	inputPrecio.attr({type: 'text'}).addClass('form-control');
	celdaPrecio.append(inputPrecio);

	if (datos != undefined) { // Si se recibe datos, se rellenan los datos
		inputCodigo.val(datos.codigo);
		celdaDescripcion.text(datos.descripcion);
		inputUnidades.val(datos.unidades);
		inputPrecio.val(datos.precio);
	}

	// Agregar celdas
	fila.append(celdaPrecio);
	TBODY.append(fila);

	// Eventos celdas
	eventoCeldas();
	actualizarContador();
}

function eliminarFila() {
	contador--;
	// Navegar a celda de arriba
	navegarCeldaVertical('arriba');

	// Borrar fila
	TBODY.find('tr:last').remove();
	actualizarContador();
}

function limpiarTabla() {
	TBODY.find('tr:not(tr:last)').remove(); // Elimina todas las filas excepto la última
	$('tbody input').val(''); // Limpia todos los inputs
	TBODY.find(`td.${CLASE_DESCRIPCION}`).text(''); // Limpia la descripción

	NOMBRE_CLIENTE_MODAL_CAMBIO.val(''); // Limpia el nombre del cliente
	COLLAPSE_NOMBRE_CLIENTE_MODAL_CAMBIO.removeClass('show'); // Elimina la clase show

	setTimeout(() => {
		TBODY.find('input:first').focus(); // Posiciona el cursor en el primer input
	}, 500);

	reiniciarContador();
}

function actualizarContador() {
	THEAD.find('th:first').text(contador);
}

function reiniciarContador() {
	contador = 1;
	actualizarContador();
}

function eventoCeldas() {
	// Evento código
	TBODY.find('th input').each((_index, element) => { // Recorre todas las celdas de código

		let celda = $(element);
		let fila = celda.parents('tr');

		celda.off('change');
		celda.on('change', (e) => {
			e.preventDefault();

			let codigo = celda.val();

			if (!codigo == '') {
				let estaEnTabla = false;
				let celdaUnidades;

				// Comprobar si el código ya está en la tabla
				TBODY.find('tr').each((_index, element) => {
					if (codigo == $(element).find(`.${CLASE_CODIGO} input`).val() && !fila.is($(element)) && parseInt(codigo) > 5) { // Si el código coincide, no es la misma fila y es mayor que 5
						celdaUnidades = $(element).find(`.${CLASE_UNIDADES} input`);
						estaEnTabla = true;
					}
				});

				if (estaEnTabla) { // Si el código ya está en la tabla
					celdaUnidades.val(parseInt(celdaUnidades.val()) + 1); // Sumar una unidad
					celda.val(""); // Vaciar el input de código

					actualizarTotal(); // Actualizar total
				} else if (isNaN(parseInt(codigo))) { // Si el código no es un número
					celda.val(""); // Vaciar el input de código
				} else { // Si el código es un número
					consultarProducto(codigo);
				}
			} else {
				vaciarFila(fila);

				actualizarTotal();
			}
		});

		function consultarProducto(codigo) {
			let datos = `codigo=${codigo}`;

			$.post("php/consultarProducto.php", datos,
				(json) => {
					if (json.resultado == 'ok') {
						let producto = JSON.parse(json.json)[0]; // Obtener primer producto

						if (producto != undefined) { // Si el producto existe
							fila.find(`.${CLASE_DESCRIPCION}`).text(producto.descripcion); // Mostrar descripción

							let inputUnidades = fila.find(`.${CLASE_UNIDADES}`); // Obtener input de unidades

							if (inputUnidades.val() == '') { // Si el input de unidades está vacío
								inputUnidades.val('1').focus().select(); // Rellenar con 1 y asignar foco
							}

							let inputPrecio = fila.find(`.${CLASE_PRECIO} input`); // Obtener input precio

							if (parseInt(codigo) < 5) { // Si el código es menor que 5
								if (inputPrecio.val() === "") { // Si el input de precio está vacío
									inputPrecio.val(numerosDecimales(0)).focus().select(); // Rellenar con 0 y asignar foco
								}
							} else { // Si el código es mayor que 5
								inputPrecio.val(numerosDecimales(producto.precio)); // Rellenar con precio del producto
							}

							actualizarTotal(); // Actualizar total
						} else { // Si el producto no existe
							vaciarFila(fila); // Limpiar fila

							msgConfirm('El producto no existe', '¿Desea agregarlo?', (respuesta) => {
								if (respuesta) {
									$('#btnInsertarProducto').click(); // Pulsar botón de insertar producto

									let codigo = fila.find(`.${CLASE_CODIGO} input`).val();
									let precio = fila.find(`.${CLASE_PRECIO} input`).val();

									setTimeout(() => { // Esperar a que se cargue la tabla
										$('#codigoAgregar').val(codigo); // Rellenar código
										$('#precioAgregar').val(precio); // Rellenar precio
										$('#descripcionAgregar').focus(); // Asignar foco a descripción
									}, 1000);
								} else {
									fila.find('input').val(''); // Vaciar input
									fila.find(`.${CLASE_DESCRIPCION}`).text(''); // Vaciar descripción
									fila.find(`.${CLASE_CODIGO} input`).focus(); // Asignar foco a código
								}

								actualizarTotal();
							});
						}
					} else {
						msg(json.msg, 'danger');
					}
				},
				"json"
			);
		}

		function vaciarFila(fila) {
			fila.find(`.${CLASE_DESCRIPCION}`).text('');
			fila.find(`.${CLASE_PRECIO} input`).val(numerosDecimales(0));
			fila.find(`.${CLASE_UNIDADES} input`).val(1);
		}
	});

	// EVENTO CELDA UNIDADES
	TBODY.find(`td.${CLASE_UNIDADES} input`).each((_index, element) => {
		let celda = $(element)

		celda.off('change');
		celda.on('change', (e) => {
			e.preventDefault();

			let input = $(e.target);

			input.val(parseInt(input.val())); // Convertir valor a entero

			if (isNaN(input.val()) || input.val() < 1) { // Si el valor no es un número o es menor que 1
				input.val('1'); // Rellenar con 1
			}

			actualizarTotal();
		});
	});

	// EVENTO CELDA PRECIO
	TBODY.find(`td.${CLASE_PRECIO} input`).each((_index, element) => {
		let celda = $(element);

		celda.off('change');
		celda.on('change', (e) => {
			e.preventDefault();

			// Actualizar precio al insertarlo en la celda
			actualizarPrecioProducto(celda);

			actualizarTotal();
			// Precio con decimales
			if (isNaN(numerosDecimales(celda.val()))) {
				celda.val('0,00');
			} else {
				celda.val(formatNumber((numerosDecimales(celda.val()))));
			}
		});
	});

	function actualizarPrecioProducto(celda) {
		let fila = celda.parents('tr');
		let codigo = fila.find(`.${CLASE_CODIGO} input`).val();
		let precio = fila.find(`.${CLASE_PRECIO} input`).val();
		fila.find(`.${CLASE_PRECIO} input`).val(formatNumber(precio)); // Formatear precio

		let datos = `codigo=${codigo}&precio=${formatNumber(precio)}`;

		if (parseInt(codigo) > 5) { // Si el código es mayor que 5
			$.post("php/actualizarPrecio.php", datos,
				(json) => {
					if (json.resultado == 'ok') {
						msg(json.msg, 'primary');
					} else {
						msg(json.msg, 'danger');
					}
				},
				"json"
			);
		}
	}

	// EVENTO CLICK SOBRE INPUT
	HTML.find('input').click((e) => {
		e.preventDefault();

		$(e.target).select();
	});

	// Autocompletar productos tabla pedidos
	getProductos('tbody tr:last-child th input');
}

function getProductos(elemento) {
	$.post("php/getProductos.php", null,
		(json) => {
			if (typeof(elemento) == 'string') {
				autocomplete(document.querySelector(elemento), json);
			} else {
				autocomplete(elemento, json);
			}
		},
		"json"
	);
}

function actualizarTotal() {
	let unidades = $(`.${CLASE_UNIDADES} input`);
	let precio = $(`.${CLASE_PRECIO} input`);
	let total = 0;

	unidades.each(function (index, unidad) {
		total += precio[index].value * unidad.value;
	});

	if (isNaN(numerosDecimales(total))) {
		total = 0;
	}

	TOTAL.val(numerosDecimales(total));
}

function imprimirTicket() {
	let url = "php/ticket.php?";

	let nombre = $('#modalNombre').val();
	let telefono = $('#modalTelefono').val();

	url += `nombre=${nombre}&telefono=${telefono}&`;

	TBODY.find('tr').each((_index, element) => {
		let fila = $(element);
		if (fila.find('input').val() != '' && fila.text() != '') {

			let descripcion = fila.find(`td.${CLASE_DESCRIPCION}`).text();
			let unidades = fila.find(`td.${CLASE_UNIDADES} input`).val();
			let precio = fila.find(`td.${CLASE_PRECIO} input`).val();
			let total = precio * unidades;

			url += `unidades[]=${unidades}&descripcion[]=${descripcion}&precio[]=${precio}&total[]=${total}&`;
		}
	});

	NOMBRE_CLIENTE_MODAL_CAMBIO.val(nombre); // Rellenar nombre en modal de cambio
	COLLAPSE_NOMBRE_CLIENTE_MODAL_CAMBIO.addClass('show'); // Mostrar modal de cambio

	// Borrar último carácter
	url = url.slice(0, -1);
	// Abrir nueva pestaña
	let ventana = window.open(url, '_blank');

	limpiarCamposModalTicket();

	ventana.print();

	function limpiarCamposModalTicket() {
		$('#myModal').modal('hide');
		$('#modalNombre').val('');
		$('#modalTelefono').val('');
		BOTON_ACEPTAR_PEDIDO.click();
	}
}

function cursorSpinner(selector) {
	$(selector).addClass('spinner-border spinner-border-sm');
	$(selector).removeClass('fa-search');
	$('*').addClass('cursor-wait');
}

function eliminarCursorSpinner(selector) {
	$(selector).removeClass('spinner-border spinner-border-sm');
	$(selector).addClass('fa-search');
	$('*').removeClass('cursor-wait');
}

function formatNumber(string) {// Devuelve un número válido
	let out = '';
	let filtro = '1234567890.,';// Caracteres validos

	// Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
	for (var i=0; i < string.length; i++) {
		if (filtro.indexOf(string.charAt(i)) != -1) {
			// Se añaden a la salida los caracteres validos
			out += string.charAt(i);
		}
	}

	// Retornar valor filtrado
	return out.split(",").join("."); // Se reemplazan las comas por puntos
}

function numerosDecimales(valor) { // Pasar un número a decimal
	return Number.parseFloat(valor).toFixed(2); // Redondear a dos decimales
}

function numerosDecimalesMostrar(valor) { // Cambia el caracter "." por ","
	return valor.split(".").join(","); // Se reemplazan los puntos por comas
}

function ocultarAlert() {
	$('.alert').css('transform', '');
	$('.alert').fadeOut(200, () => {
		$('.alert').remove();
	});
}

function msg(txt, color) {
	ocultarAlert();

	let clase = "";
	let icono = $('<i>');
	icono.addClass('fas icon-alert');

	switch (color) {
		case 'success':
			icono.addClass('fa-check-circle');
		case 'verde':
			clase = "alert-success";
			break;

		case 'danger':
			icono.addClass('fa-times-circle');
		case 'rojo':
			clase = "alert-danger";
			break;

		case 'primary':
			icono.addClass('fa-info-circle');
		case 'azul':
			clase = "alert-primary";
			break;

		case 'info':
			icono.addClass('fa-info-circle');
		case 'cyan':
			clase = "alert-info";
			break;

		case 'warning':
			icono.addClass('fa-exclamation-triangle');
		case 'amarillo':
			clase = "alert-warning";
			break;

		case 'naranja':
			clase = "alert-naranja";
			break;

		case 'morado':
			clase = "alert-morado";
			break;

		case 'rosa':
			clase = "alert-rosa";
			break;

		case 'marron':
			clase = "alert-marron";
			break;

		default:
			clase = "alert-success";
			break;
	}

	setTimeout(() => {
		let alert = $('<div>');
		let texto = $('<strong>');

		texto.text(txt);
		alert.append(icono);

		let boton = $('<button>');
		boton.prop({
			'data-bs-dismiss': 'alert',
			'type': 'button'
		})
		boton.addClass('btn-close');

		alert.addClass(`alert ${clase} shadow alert-dismissible justify-content-start`);
		alert.append(texto);

		BODY.append(alert);
		alert.append(boton);

		$('.alert').css('transform', 'translateY(10em)').fadeIn(); // Mostrar alerta

		setTimeout(() => { // Ocultar alert
			$('.alert').css('transform', '').fadeOut(); // Ocultar alerta
		}, 3000);

		$('.btn-close').click((e) => {
			e.preventDefault();

			$('.alert').css('transform', '').fadeOut(); // Ocultar alerta
		});
	}, 500);
}

function consola(txt) {
	console.log(txt);
}