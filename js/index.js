var contador = 1;
const HTML = $('html');
const BODY = $('body');

const TABLA = $('#tabla');
const THEAD = TABLA.find('thead');
const TBODY = TABLA.find('tbody:first');
const TOTAL = $('#total');
const TOTAL_NAVBAR = $('#navbarText');
const AUDIO_ERROR = 'audio/windows-error-sound-effect.mp3';
const AUDIO_SANTA = 'audio/santa-claus-merry-christmas-ho-ho-ho.mp3';

// Clases de las columnas
const CLASE_CODIGO = 'col-codigo';
const CELDA_CODIGO = `.${CLASE_CODIGO}`;
const INPUT_CODIGO = `.${CLASE_CODIGO} input`;
const CLASE_DESCRIPCION = 'col-descripcion';
const CELDA_DESCRIPCION = `td.${CLASE_DESCRIPCION}`;
const CLASE_PRECIO = 'col-precio';
const CELDA_PRECIO = `.${CLASE_PRECIO}`;
const INPUT_PRECIO = `.${CLASE_PRECIO} input`;
const CLASE_UNIDADES = 'col-unidades';
const CELDA_UNIDADES = `.${CLASE_UNIDADES}`;
const INPUT_UNIDADES = `.${CLASE_UNIDADES} input`;
const CLASE_EXISTENCIAS = 'col-existencias';
const CLASE_MINIMO = 'col-minimo';
const CLASE_FALTAN = 'col-faltan';

const NOMBRE_CLIENTE_MODAL_CAMBIO = $('#nombreClienteModalCambio');
const COLLAPSE_NOMBRE_CLIENTE_MODAL_CAMBIO = $('#collapseNombreClienteModalCambio');
const AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO = 'agregarFila';
const MOSTRAR_FAMILIA_TABLA = 'mostrarFamilia';

const BOTON_TO_TOP = $('#toTop');
const BOTON_AGREGAR_FILA = $('#btnAddRow');
const BOTON_ACEPTAR_PEDIDO = $('#btnAceptarPedido');
const BOTON_CANCELAR_PEDIDO = $('#btnCancelarPedido');
const BOTON_CANCELAR_PEDIDO_NAVBAR = $('#btnCancelarPedidoNavbar');
const BOTON_IMPRIMIR_PEDIDO = $('#btnTicket');

$(function () {
	// $('#qrCanvas').WebCodeCam();
	// Eventos de teclado
	let primeraFila = TBODY.children('tr');

	eventoCeldas(primeraFila);
	limpiarTabla();

	// Cargar menu contextual
	$.getScript("js/contextmenu/menuContextual.js");

	// Script para el menu
	$.getScript("js/menu/menu.js");

	// Script modalCambio
	$.getScript("js/modalCambio/modalCambio.js");

	// Navegación entre celdas
	tablaNavegable();

	$(window).scroll(() => {
		toggleTotalNavbar();
	});

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
		TBODY.find(`tr:first ${CELDA_DESCRIPCION}`).text('');
		// Asigna el foco al campo código
		TBODY.find("th input").select();

		toggleTotalNavbar();
		actualizarTotal();
		reiniciarContador();
	});

	BOTON_CANCELAR_PEDIDO_NAVBAR.click((e) => {
		e.preventDefault();

		BOTON_CANCELAR_PEDIDO.click();
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

	function toggleTotalNavbar() {
		let filaTotal = $('.fila-total')[0];

		if (isInViewport(filaTotal)) {
			$('#inputGroupNavbarText').fadeOut();
		} else {
			TOTAL_NAVBAR.val(TOTAL.val());
			$('#inputGroupNavbarText').fadeIn();
		}
	}

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
					if (isEmpty(TBODY.find('tr:last input').val())) {
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
	eventoCeldas(fila);
	actualizarContador();

	inputCodigo.focus();
	$(window).scroll();
}

function eliminarFila() {
	contador--;
	// Navegar a celda de arriba
	navegarCeldaVertical('arriba');

	// Borrar fila
	TBODY.find('tr:last').remove();
	actualizarContador();
	$(window).scroll();
}

function vaciarFila(fila) {
	fila.find(CELDA_DESCRIPCION).text('');
	fila.find(INPUT_PRECIO).val(numerosDecimalesMostrar(0));
	fila.find(INPUT_UNIDADES).val(1);
}

function limpiarTabla() {
	TOTAL_NAVBAR.val('');
	TBODY.find('tr:not(tr:last)').remove(); // Elimina todas las filas excepto la última
	$('tbody input').val(''); // Limpia todos los inputs
	TBODY.find(CELDA_DESCRIPCION).text(''); // Limpia la descripción

	NOMBRE_CLIENTE_MODAL_CAMBIO.val(''); // Limpia el nombre del cliente
	COLLAPSE_NOMBRE_CLIENTE_MODAL_CAMBIO.removeClass('show'); // Elimina la clase show

	setTimeout(() => {
		TBODY.find('input:first').focus(); // Posiciona el cursor en el primer input
	}, 500);

	reiniciarContador();
}

function actualizarContador() {
	THEAD.find('th:first').html(`# ${contador}`);
}

function reiniciarContador() {
	contador = 1;
	actualizarContador();
}

function eventoCeldas(fila) {
	// Evento código
	let inputCodigo = fila.find(INPUT_CODIGO);

	fila.dblclick((e) => {
		e.preventDefault();

		let codigo = fila.find('th input').val();

		if (isEmpty(codigo)) {
			msg('No hay ningún producto en la fila.', 'danger');
		} else {
			$('#btnConsultarProducto').click();
	
			// ABRIR CONSULTAR PRODUCTO
			setTimeout(() => {
				$('#codigoConsultar').val(codigo);
	
				$('#btnBuscarProducto').click();
	
				setTimeout(() => {
					$('.btn-ver-producto').click();
				}, 500);
			}, 1000);
		}
	});
/*
	let = modalAutocompletarInputDescripcion = $('#modalAutocompletarInputDescripcion');

	modalAutocompletarInputDescripcion.keyup((e) => { 
		e.preventDefault();

		inputCodigo.val(modalAutocompletarInputDescripcion.val()).keyup();
	});
/*
	inputCodigo.keyup((e) => { 
		e.preventDefault();

		modalAutocompletarInputDescripcion.val(inputCodigo.val());

		getProductos(inputCodigo); // Abrir modal lista productos
		
	});
*/
	inputCodigo.change((e) => {
		e.preventDefault();

		let codigo = inputCodigo.val();

		if (!isEmpty(codigo)) { // Si el código no está vacío
			if (isNaN(parseInt(codigo))) { // Si el código no es un número
				// Autocompletar productos tabla pedidos
				// getProductos(); // Abrir modal lista productos
			} else {
				let productoEnTabla = false;
				let celdaUnidades;

				// Comprobar si el código ya está en la tabla
				TBODY.find('tr').each((_index, filaBuscada) => {
					let codigoBuscado = $(filaBuscada).find(INPUT_CODIGO).val();

					if (codigo == codigoBuscado && !fila.is($(filaBuscada)) && parseInt(codigo) > 4) { // Si el código coincide, no es la misma fila y es mayor que 5
						celdaUnidades = $(filaBuscada).find(INPUT_UNIDADES);
						productoEnTabla = true;
					}
				});

				if (productoEnTabla) { // Si el código ya está en la tabla
					celdaUnidades.val(parseInt(celdaUnidades.val()) + 1); // Sumar una unidad
					inputCodigo.val(""); // Vaciar el input de código

					actualizarTotal(); // Actualizar total
					let ultimaFila = TBODY.find('tr:last');
					ultimaFila.find(INPUT_CODIGO).focus();
				} else { // Si el código es un número
					consultarProducto(codigo);
				}
			}
		} else { // Si el código está vacío
			vaciarFila(fila);

			actualizarTotal();
		}
	});

	function consultarProducto(codigo) {
		let datos = `codigo=${codigo}`;

		$.get("php/consultarProducto.php", datos,
			(json) => {
				if (json.resultado == 'ok') {
					let producto = JSON.parse(json.json)[0]; // Obtener primer producto

					if (producto != undefined) { // Si el producto existe
						let celdaDescripcion = fila.find(CELDA_DESCRIPCION);
						celdaDescripcion.text(producto.descripcion.toUpperCase()); // Mostrar descripción

						if (getItem(MOSTRAR_FAMILIA_TABLA) == "true") { // Mostrar etiqueta familia
							let badge = $('<span>');
							badge.addClass('badge rounded-pill align-top ms-2').text(producto.familia);
	
							switch (producto.color) {
								case 'rojo':
									badge.addClass('bg-danger');
									break;

								case 'azul':
									badge.addClass('bg-primary');
									break;

								case 'verde':
									badge.addClass('bg-success');
									break;

								case 'amarillo':
									badge.addClass('bg-warning text-dark');
									break;

								case 'cyan':
									badge.addClass('bg-info text-dark');
									break;

								case null:
								default:
									badge.addClass('bg-secondary');
									break;
							}

							celdaDescripcion.append(badge);
						}

						let inputUnidades = fila.find(INPUT_UNIDADES); // Obtener input de unidades

						if (isEmpty(inputUnidades.val())) { // Si el input de unidades está vacío
							inputUnidades.val('1'); // Rellenar con 1 y asignar foco
						}

						let inputPrecio = fila.find(INPUT_PRECIO); // Obtener input precio

						if (isEmpty(producto.precio)) { // Si el producto no tiene precio establecido
							if (isEmpty(inputPrecio.val())) { // Si el input de precio está vacío
								inputPrecio.val(numerosDecimalesMostrar(0)); // Rellenar con 0
							} else {
								inputPrecio.val(numerosDecimalesMostrar(inputPrecio.val())); // Rellenar con el valor del input
							}

							inputPrecio.focus().select() // Asignar foco
						} else { // Si el producto tiene precio establecido
							inputPrecio.val(numerosDecimalesMostrar(producto.precio)); // Rellenar con precio del producto

							if (getItem(AGREGAR_FILA_TRAS_CONSULTAR_PRODUCTO) == "true") {
								let ultimaFila = TBODY.find('tr:last');
								let codigoUltimaFila = ultimaFila.find(INPUT_CODIGO);

								if (isEmpty(codigoUltimaFila.val())) {
									codigoUltimaFila.select().focus();
								} else {
									agregarFila();
								}
							} else {
								inputUnidades.select().focus();
							}
						}
					} else { // Si el producto no existe
						vaciarFila(fila); // Limpiar fila

						let audio = new Audio(AUDIO_ERROR); // Soniod error
						audio.play();

						msgConfirm('El producto no existe', '¿Desea agregarlo?', (respuesta) => {
							if (respuesta) {
								$('#btnInsertarProducto').click(); // Pulsar botón de insertar producto

								let codigo = fila.find(INPUT_CODIGO).val();
								let precio = fila.find(INPUT_PRECIO).val();

								setTimeout(() => { // Esperar a que se cargue la tabla
									$('#codigoAgregar').val(codigo); // Rellenar código
									$('#precioAgregar').val(precio); // Rellenar precio
									$('#descripcionAgregar').focus(); // Asignar foco a descripción
								}, 1000);
							} else {
								fila.find('input').val(''); // Vaciar input
								fila.find(CELDA_DESCRIPCION).text(''); // Vaciar descripción
								fila.find(INPUT_CODIGO).focus(); // Asignar foco a código
							}
						});
					}

					actualizarTotal(); // Actualizar total
				} else {
					msg(json.msg, 'danger');
				}
			},
			"json"
		);
	}

	// EVENTO CELDA UNIDADES
	let inputUnidades = fila.find(INPUT_UNIDADES);

	inputUnidades.change((e) => {
		e.preventDefault();

		let input = $(e.target);

		input.val(parseInt(input.val())); // Convertir valor a entero

		if (isNaN(input.val()) || input.val() < 1) { // Si el valor no es un número o es menor que 1
			input.val('1'); // Rellenar con 1
		}

		actualizarTotal();
	});

	// EVENTO CELDA PRECIO
	let inputPrecio = fila.find(INPUT_PRECIO);

	inputPrecio.change((e) => {
		e.preventDefault();

		// Actualizar precio al insertarlo en la celda
		actualizarPrecioProducto(inputPrecio);

		// Precio con decimales
		if (isNaN(numerosDecimales(inputPrecio.val()))) {
			inputPrecio.val('0.00');
		} else {
			inputPrecio.val(numerosDecimalesMostrar(inputPrecio.val()));
		}

		actualizarTotal();
	});

	function actualizarPrecioProducto() {
		let codigo = fila.find(INPUT_CODIGO).val();
		let precio = fila.find(INPUT_PRECIO).val();
		fila.find(INPUT_PRECIO).val(formatNumber(precio)); // Formatear precio

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
	HTML.find('input').off('click');
	HTML.find('input').on('click', (e) => {
		e.preventDefault();

		$(e.target).select();
	});
	
	getProductos('tbody tr:last-child th input');
}
/*
function getProductos(inputCodigo) {
	let descripcion = inputCodigo.val();
	$.get("php/getProductos.php", `descripcion=${descripcion}`,
		(json) => {
			autocompletar(json, inputCodigo, descripcion);
		},
		"json"
	);
}
 */
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
/*
function autocompletar(productos, inputCodigo, descripcion) {
		let options = {backdrop: false, keyboard: false, show: true, focus: false};
		const modalAutocompletar = new bootstrap.Modal('#modalAutocompletar', options);

		document.getElementById('modalAutocompletar').addEventListener('hidden.bs.modal', event => { // Evento hidden modal
			inputCodigo.val('');
		  })
		  

		let codigo = inputCodigo.val();

		if (codigo.length > 2 && (isNaN(parseInt(codigo)))) {
			modalAutocompletar.show('#modalAutocompletar');
		}

		let modalBody = $('#modalBodyAutocompletar');
		

		modalBody.empty();

		let lista = $('<ul>');
		lista.addClass('list-group');

		let i = 0;
		productos.forEach(producto => {
			let itemLista = $('<li>');
			itemLista.addClass('list-group-item cursor-pointer');

			let valorBuscado = (producto.descripcion.toUpperCase().search(descripcion.toUpperCase()));

//			itemLista.text(producto.descripcion.substr(0, descripcion));
			itemLista.html(`${producto.descripcion.substr(0, valorBuscado)}<strong class="text-primary">${producto.descripcion.substr(valorBuscado, inputCodigo.val().length)}</strong>${producto.descripcion.substr((valorBuscado + inputCodigo.val().length), producto.descripcion.length)}`);
//			itemLista.text(producto.descripcion.substr((descripcion + inputCodigo.val().length), producto.descripcion.length));
			itemLista.click((e) => { 
				e.preventDefault();

				inputCodigo.val(producto.codigo);
				inputCodigo.change();
				modalAutocompletar.hide('#modalAutocompletar');
			});
			lista.append(itemLista);

			let img = $('<img>');
			img.attr('src', producto.url_imagen);
			img.addClass('img-fluid rounded float-end w-25');
			itemLista.append(img);

			i++;
		});

		if (i == 0) {
			msg('Ningún producto coincide con la descripción', 'warning');

			let img = $('<img>');
			img.attr('src', './img/productos/carritoVacio.png');
			img.addClass('img-thumbnail img-fluid w-25');
			lista.append(img);
		}
		modalBody.append(lista);
}
*/
function actualizarTotal() {
	let inputUnidades = $(INPUT_UNIDADES);
	let inputPrecios = $(INPUT_PRECIO);
	let total = 0;

	inputUnidades.each(function (index, inputUnidad) {
		let precio = inputPrecios[index].value;
		let unidad = inputUnidad.value;

		if (!isNaN(numerosDecimales(precio)) && !isNaN(unidad)) { // Si el precio y la unidad son números
			total += numerosDecimales(precio) * unidad; // Sumar al total
		}
	});

	let valor = `${numerosDecimalesMostrar(total)} €`;

	TOTAL.val(valor); // Actualizar total
	TOTAL_NAVBAR.val(valor);
}

function imprimirTicket() {
	let url = "php/ticket.php?";

	let nombre = $('#modalNombre').val();
	let telefono = $('#modalTelefono').val();

	url += `nombre=${nombre}&telefono=${telefono}&`;

	TBODY.find('tr').each((_index, element) => {
		let fila = $(element);
		if (fila.find('input').val() != '' && fila.text() != '') {

			let descripcion = fila.find(CELDA_DESCRIPCION).text();
			let unidades = fila.find(INPUT_UNIDADES).val();
			let precio = numerosDecimales(fila.find(INPUT_PRECIO).val());
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
		$('#modalNombre').val('');
		$('#modalTelefono').val('');
		BOTON_ACEPTAR_PEDIDO.click();
	}
}

function isEmpty(valor) {
	if (isNaN(valor)) {
		if (valor == undefined) {
			return true;
		} else {
			return false;
		}
	} else if (valor == 0) {
		return true;
	} else if (valor == '') {
		return true;
	} else if (valor == null) {
		return true;
	} else {
		return false;
	}
}

function isInViewport(elem) {
	let distance = elem.getBoundingClientRect();
	return (
		(distance.top + (distance.height / 2)) < (window.innerHeight || document.documentElement.clientHeight) && distance.bottom > 0
	);
}

function setItem(id, valor) {
	localStorage.setItem(id, valor);
}

function getItem(id) {
	return localStorage.getItem(id);
}

function clearItems(id) {
	localStorage.removeItem(id);
}

function cursorSpinner(selector) {
	if (!isEmpty(selector)) {
		$(selector).addClass('spinner-border spinner-border-sm');
		$(selector).removeClass('fa-search');
	}
	$('*').addClass('cursor-wait');
}

function eliminarCursorSpinner(selector) {
	if (!isEmpty(selector)) {
		$(selector).removeClass('spinner-border spinner-border-sm');
		$(selector).addClass('fa-search');
	}
	$('*').removeClass('cursor-wait');
}

function formatNumber(string) {// Devuelve un número válido
	let out = '';
	let filtro = '-1234567890.,';// Caracteres validos

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
	if (typeof(valor) == 'number') {
		return Number.parseFloat(valor).toFixed(2); // Redondear a dos decimales
	} else {
		return Number.parseFloat(valor.split(",").join(".")).toFixed(2);
	}
}

function numerosDecimalesMostrar(valor) { // Cambia el caracter "." por ","
	if (typeof(valor) == 'number') {
		return numerosDecimales(valor).toString().split(".").join(","); // Se reemplazan los puntos por comas
	} else {
		return numerosDecimales(valor).split(".").join(","); // Se reemplazan los puntos por comas
	}
}

function formatoFecha(fecha) { // Formato de fecha: dd/mm/yyyy
	fecha = fecha.split('/');
	fecha = fecha.reverse();
	fecha = fecha.toString();
	fecha = fecha.replace(/,/g, "-");
	return fecha; // Formato de fecha: yyyy-mm-dd
}

function formatoFechaMostrar(fecha) { // Formato de fecha: yyyy-mm-dd
	fecha = fecha.split('-');
	fecha = fecha.reverse();
	fecha = fecha.toString();
	fecha = fecha.replace(/,/g, "/");
	return fecha; // Formato de fecha: dd/mm/yyyy
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

let fechaHoy = new Date();

let fechaInicioNavidad = new Date();
fechaInicioNavidad.setDate(9);
fechaInicioNavidad.setMonth(11)

let fechaFinNavidad = new Date();
fechaFinNavidad.setDate(31);
fechaFinNavidad.setMonth(11);

if (fechaHoy.getDate() >= fechaInicioNavidad.getDate() && fechaHoy.getMonth() >= fechaInicioNavidad.getMonth() && fechaHoy.getDate() <= fechaFinNavidad.getDate() && fechaHoy.getMonth() >= fechaFinNavidad.getMonth()) {
	navidad();
}

function navidad() {
	let html = document.querySelector('html');
	let body = document.querySelector('body');

	let brand = document.querySelector('#brand');
	brand.classList.remove('d-none');

	let santa = document.createElement('img');
	santa.setAttribute('src', 'img/santa.png');
	santa.classList.add('w-10');
	santa.style.top = BODY.height() / 2;
	santa.style.position = "absolute";

	body.append(santa);

	let pos = BODY.width();
	let audioSanta = new Audio(AUDIO_SANTA); // Soniod error
	audioSanta.play();

	setInterval(() => {
		if (pos <= (-santa.width * 40)) {
			pos = BODY.width();
			audioSanta.play();
		} else {
			pos--;
			santa.style.left = `${pos}px`
		}
	}, 10);

	let intervalNevada = setInterval(() => {
		let copo;
		copo = document.createElement('div');
		
		copo.classList.add('copo-nieve');
		
		let enteroAnimacion = Math.floor(Math.random() * 6);
		let enteroOrigen = Math.floor(Math.random() * 100);
		
		copo.classList.add(`animacion${enteroAnimacion}`);
		copo.style.left = `${enteroOrigen}%`;
		html.append(copo);

		setInterval(() => {
			copo.remove();
		}, 15000);
	}, 500);

	body.style.backgroundImage = "url(img/fondo_navidad2.png)"; 
	body.style.backgroundRepeat = "no-repeat";
	body.style.backgroundSize = "cover";
	body.style.textShadow = "0 0 3px #FFF, 0 0 5px #FFF";

	html.style.backgroundImage = "url(img/fondo_navidad.png)"; 
	html.style.backgroundRepeat = "no-repeat";
	html.style.backgroundSize = "cover";
	html.style.backgroundPositionY = `${BODY.height() - 250}px`;

}

function consola(txt) {
	console.log(txt);
}