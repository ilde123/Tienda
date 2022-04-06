const CONTENIDO = $('#contenidoFormularios');
CONTENIDO.hide();

$('#btnInsertarProducto').click((e) => {
	e.preventDefault();

	// MOSTRAR Y CARGAR EL FORMULARIO PRODUCTOS
	cargarFormularioProducto();
});

$('#btnConsultarProducto').click((e) => { 
	e.preventDefault();

	cargarFormularioProducto('consulta');
});

$('#btnOferta').click((e) => { 
	e.preventDefault();

	cargarFormularioOferta();
});

// Formulario Pedidos
$('#btnPedidos').click((e) => { 
	e.preventDefault();

	cargarFormularioPedido();
});

// Script cargarFormularioPedido
$.getScript("js/forms/formularioPedidos.js");

// Formulario proveedores
$('#btnProveedores').click((e) => { 
	e.preventDefault();

	cargarFormularioProveedores();
});

// Script cargarFormularioProveedores
$.getScript("js/forms/formularioProveedores.js");

$('#btnFamilias').click((e) => {
	e.preventDefault();
	
	cargarFormularioFamilias();
});

// Formulario familias
$.getScript("js/forms/formularioFamilias.js");

$('#btnExistencias').click((e) => {
	e.preventDefault();
	
	cargarFormularioExistencias();
});

// Script cargarFormularioExistencias
$.getScript("js/forms/formularioExistencias.js");

$('#btnSalir').click((e) => { 
	e.preventDefault();

	close();
});

$('#btnQr').click(function (e) { 
	e.preventDefault();

	$('.barcodelector').slideToggle();
});

// Script calculadora
$.getScript("js/calculadora/calculadora.js");

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

function cargarFormularioOferta(opciones) {
	TABLA.fadeOut(function () {
		CONTENIDO.load("html/frmOferta.html", null, function (response, status, request) {
			// MOSTRAR FORMULARIO
			CONTENIDO.fadeIn();
			
			btnVolver();
		});
	});
}

function cargarFormulario(url, callback) {
	TABLA.fadeOut(() => {
		CONTENIDO.load(url, null , () => {
			CONTENIDO.fadeIn();

			callback();
		});
	});
}

function cargarFormularioProducto(opciones) {
	TABLA.fadeOut(function () {
		CONTENIDO.load("html/frmProducto.html", null, function (response, status, request) {
			if (opciones === "consulta") {
				$('#v-pills-profile-tab').trigger('click'); // Abrir pestaña consulta
			}

			// CREAR SPINNER INPUT NUMÉRICO
			$('#precioAgregar, #precioAgregarOferta, #precioConsultar, #precioModalProducto').inputSpinner();
			$('#stockAgregar, #stockMinAgregar, #stockConsultar, #stockMinConsultar, #stockModalProducto, #stockMinModalProducto').inputSpinner();

			// CARGAR DATOS SELECT
			//	Cargar datos familias
			getFamilias('#familiaAgregar, #familiaConsultar, #familiaModalProducto');

			//		PROVEEDORES
			getProveedores('#proveedorAgregar, #proveedorConsultar, #proveedorModalProducto');

			// MOSTRAR FORMULARIO
			CONTENIDO.fadeIn();
			btnVolver();

			// BOTÓN AGREGAR PRODUCTO
			$('#btnAgregarProducto').click(function (e) {
				e.preventDefault();

				// COMPROBAR SI EL FORMULARIO ES VÁLIDO
				if (validarFormularioProducto('Agregar')) {
					let datos = $('form[name="formAgregarProducto"]').serializeArray();
					
					datos[2].value = numerosDecimales(formatNumber($('#precioAgregar').next().find('input').val()));

					insertarProducto(datos);
					limpiarFormularioProducto('Agregar');

					// ACTUALIZAR LOS PRODUCTOS DE LA TABLA VENTAS EN MOSTRADOR
					//$('tbody:first th input').trigger('change');
					actualizarTotal();
				}
				else {
					msg('Revise los campos', 'rojo');
				}
			});

			// BOTÓN CONSULTAR PRODUCTO
			$('#btnBuscarProducto').click(function (e) {
				e.preventDefault();

				// CAMBIAR CURSOR
				$('#btnBuscarProducto i').addClass('spinner-border spinner-border-sm');
				$('#btnBuscarProducto i').removeClass('fa-search');
				$('*').addClass('cursor-wait');

				let datos = $('form[name="formConsultarProducto"]').serializeArray();

				$.post("php/consultarProducto.php", datos,
					function (json, textStatus, jqXHR) {
						if (json.resultado == 'ok') {
							let productos = JSON.parse(json.json);

							$('#tablaProducto tbody').empty();

							$.each(productos, function (indexInArray, valueOfElement) {
								agregarFilaProducto(this);
							});

							$('#btnBuscarProducto i').removeClass('spinner-border spinner-border-sm');
							$('#btnBuscarProducto i').addClass('fa-search');
							$('*').removeClass('cursor-wait');

							menuContextualTablaConsultarProducto();
							// FILTRO PARA LA TABLA
							filtro("#descripcionConsultar, #codigoConsultar", "#tablaProducto tbody tr");

							// EVENTO MOSTRAR MODAL
							$('#modalProducto').on('show.bs.modal', function (event) {
								let button = $(event.relatedTarget); // Button that triggered the modal
								let json = button.parents('tr').data('producto'); // Extract info from data-* attributes
								// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
								// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
								let modal = $(this);

								// DESTRUIR SPINNER INPUT NUMÉRICO MODAL
								$('#precioModalProducto').inputSpinner("destroy");
								$('#stockModalProducto, #stockMinModalProducto').inputSpinner("destroy");

								formModalProducto.codigoModalProducto.value = json.codigo;
								formModalProducto.descripcionModalProducto.value = json.descripcion;
								formModalProducto.precioModalProducto.value = json.precio;
								formModalProducto.ivaModalProducto.value = json.iva;
								formModalProducto.stockModalProducto.value = json.stock;
								formModalProducto.stockMinModalProducto.value = json.stock_minimo;
								formModalProducto.familiaModalProducto.value = json.familia;
								formModalProducto.proveedorModalProducto.value = json.proveedor;

								// RECREAR SPINNER INPUT NUMÉRICO MODAL
								$('#precioModalProducto').inputSpinner();
								$('#stockModalProducto, #stockMinModalProducto').inputSpinner();

								$('#productoFavorito').click(function (e) { 
									e.preventDefault();

									$(this).toggleClass('fa');
								});

								// BOTÓN EDITAR PRODUCTO
								$('#btnEditarProducto').off('click');
								$('#btnEditarProducto').on('click', function (e) {
									e.preventDefault();

									if (validarFormularioProducto('ModalProducto')) {
										let datos = $('form[name="formModalProducto"]').serializeArray();
										datos[2].value = numerosDecimales(formatNumber($('#precioModalProducto').next().find('input').val()));
					
										insertarProducto(datos);

										// ACTUALIZAR DATOS PRODUCTO EN FORMULARIO
										let jsonProducto = {
											codigo: datos[0].value,
											descripcion: datos[1].value,
											precio: datos[2].value,
											iva: datos[3].value,
											familia: datos[4].value,
											proveedor: datos[5].value,
											stock: datos[6].value,
											stock_minimo: datos[7].value
										};

										button.data('producto', jsonProducto);
										button.parents('tr').find('th').text(jsonProducto.codigo);
										button.parents('tr').find('a').text(jsonProducto.descripcion);

										// OCULTAR MODAL
										modal.modal('hide');
										limpiarFormularioProducto('ModalProducto');
									}
									else {
										msg('Revise los campos', 'rojo');
									}
								});
							});

							$('#modalProducto').on('hide.bs.modal', function (event) {
								limpiarFormularioProducto('ModalProducto');
								$('tbody:first th input').trigger('change');
							});

							$('#modalEliminarProducto').on('show.bs.modal', function (event) {
								let button = $(event.relatedTarget); // Button that triggered the modal
								let json = button.parents('tr').data('producto'); // Extract info from data-* attributes
								// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
								// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
								let modal = $(this);

								// BOTÓN ELIMINAR PRODUCTO
								$('#btnEliminarProducto').off('click');
								$('#btnEliminarProducto').on('click', function (e) {
									e.preventDefault();

									let datos = "codigo=" + json.codigo;

									$.post("php/eliminarProducto.php", datos,
										function (json, textStatus, jqXHR) {
											if (json.resultado == 'ok') {
												msg(json.msg, 'azul');
												button.parents('tr').fadeOut(function () {
													button.parents('tr').remove();
												});
											} else {
												msg(json.msg, 'rojo');
											}
										},
										"json"
									);

									// OCULTAR MODAL
									modal.modal('hide');
								});
							});


							// MOSTRAR TABLA PRODUCTOS
							$('div.contenido-oculto').slideDown();
						} else {
							msg('Error', 'rojo');
						}
					},
					"json"
				);
			});
		});
	});
}

function menuContextualTablaConsultarProducto() {
	document.oncontextmenu = function(e) {
		e.preventDefault();
	}

	$.contextMenu({
		selector: '.menu-producto',
		callback: function (key, options, e) {
			let m = "clicked: " + key;
			//window.console && console.log(o) || alert(o);

			// FILA AFECTADA
			let fila = $(options.$trigger[0]);

			switch (key) {
				case 'delete':
					fila.find('.btn-danger').trigger('click');
					break;

				case 'ver':
					fila.find('a').trigger('click');
					break;

				case 'copy':
					fila.find('.col-codigo').select();
					document.execCommand("copy");
					break;

				default:
					break;
			}
		},
		items: {
			"ver": { name: "Ver/Modificar", icon: "fa-eye", accesskey: 'v' },
			"delete": { name: "Eliminar", icon: "delete", accesskey: 'e' },
			copy: { name: "Copiar", icon: "copy", accesskey: 'c' },
			"sep1": "---------",
			"quit": {
				name: "Cancelar", icon: function () {
					return 'context-menu-icon context-menu-icon-quit';
				}
			}
		}
	});
}

function insertarProducto(datos) {
	$.post("php/insertarProducto.php", datos,
		function (json, textStatus, jqXHR) {
			if (json.resultado = 'ok') {
				msg(json.msg, 'azul');
			}
			else {
				msg(json.msg, 'rojo');
			}

			return json;
		},
		"json"
	);
}

function agregarFilaProducto(producto) {
	let tbody = $('#tablaProducto tbody');
	let fila = $("<tr>");
	fila.data('producto', producto).addClass('menu-producto');

	// PRIMERA CELDA
	let celda = $("<th>");
	celda.attr('scope', 'row').addClass('col-codigo').text(producto.codigo);
	fila.append(celda);

	// SEGUNDA CELDA
	celda = $('<td>');
	let enlace = $('<a>').text(producto.descripcion).attr({
		'href': '#'
	});

	celda.addClass('col-descripcion').append(enlace);
	fila.append(celda);

	// TERCERA CELDA
	celda = $('<td>');

	// GRUPO
	let buttonGroup = $('<div>').addClass('btn-group');

	// BOTÓN EDITAR/VISUALIZAR
	let boton = $('<button>').attr({
		type: 'button',
		'data-toggle': 'modal',
		'backdrop': "static",
		'data-target': '#modalProducto'
	}).addClass('btn btn-warning');

	enlace.click(function (e) { 
		e.preventDefault();

		$(this).parents('td').next().find('button:first').trigger('click');
	});

	let icono = $('<i>').addClass('far fa-eye');
	boton.append(icono);
	buttonGroup.append(boton);

	// BOTÓN ELIMINAR
	boton = $('<button>').attr({
		type: 'button',
		'data-toggle': 'modal', 
		'data-target': '#modalEliminarProducto'
	}).addClass('btn btn-danger btn-eliminar-producto');

	icono = $('<i>').addClass('fas fa-trash');
	boton.append(icono);
	buttonGroup.append(boton);
	celda.addClass('col-opciones').append(buttonGroup);
	fila.append(celda);

	// AGREGAR CELDAS
	tbody.append(fila);
}

function btnVolver() {
	$('.btn-volver').click((e) => { 
		e.preventDefault();

		ocultarContenidoFormularios();
	});
}

function ocultarContenidoFormularios() {
	CONTENIDO.fadeOut(() => {
		TABLA.fadeIn(() => {
			CONTENIDO.empty();
			setTimeout(() => {
				TBODY.find('th input').trigger('change').select();
			}, 500);
		});
	});
}

// Validaciones

function campoValido(input) {
	input.addClass('is-valid').removeClass('is-invalid');
	return true;
}

function campoNoValido(input) {
	input.addClass('is-invalid').removeClass('is-valid');
	return false;
}

function validarInputVacio(input) { // Validar campo vacío
	if (input.val() != '') {
		return campoValido(input); // return true
	} else {
		return campoNoValido(input); // return false
	}
}

function validarInputExReg(input, eReg) { // Validar campo mediante expresión regular
	if (eReg.test(input.val())) {
		return campoValido(input); // return true
	} else {
		return campoNoValido(input); // return false
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
	let valido = true;

	// Validar campo descripción
	let descripcion = $('#descripcionModalProveedor');

	valido = validarDescripcionModalProveedor(descripcion);

	descripcion.keyup(() => {
		valido = validarDescripcionModalProveedor(descripcion);
	});

	// Validar campo dirección
	let direccion = $('#direccionModalProveedor');

	valido = validarInputVacio(direccion);

	direccion.keyup(() => {
		valido = validarInputVacio(direccion);
	});

	// Validar campo teléfono
	let telefono = $('#telefonoModalProveedor');
	let eReg = /^[9|6|7]{1}([\d]{2}[-]*){3}[\d]{2}$/; // Expresión regular

	validar = validarInputExReg(telefono, eReg);

	telefono.keyup(() => {
		validar = validarInputExReg(telefono, eReg);
	});

	return valido;
}

function validarFormularioProducto(clase) {
	let valido = true;

	// CAMPO CÓDIGO
	let codigo = $('#codigo' + clase);
	let eReg = /^[0-9]+$/;

	codigo.keyup(function () { 
		if (eReg.test(codigo.val())) {
			codigo.addClass('is-valid').removeClass('is-invalid');
		} else {
			codigo.addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	let descripcion = $('#descripcion' + clase);

	descripcion.keyup(function (e) { 
		if ($(this).val() != '') {
			$(this).addClass('is-valid').removeClass('is-invalid');
		} else {
			$(this).addClass('is-invalid').removeClass('is-valid');
			valido = false;
		}
	}).trigger('keyup');

	let precio = $('#precio' + clase).addClass('is-valid');
	let iva = $('#iva' + clase).addClass('is-valid');
	let familia = $('#familia' + clase).addClass('is-valid');
	let proveedor = $('#proveedor' + clase).addClass('is-valid');
	let stock = $('#stock' + clase).addClass('is-valid');
	let stockMin = $('#stockMin' + clase).addClass('is-valid');

	return valido;
}

function limpiarFormularioProducto(clase) {
	let codigo = $('#codigo' + clase);
	codigo.removeClass('is-valid is-invalid').val('');

	let descripcion = $('#descripcion' + clase);
	descripcion.removeClass('is-valid is-invalid').val('');

	let precio = $('#precio' + clase);
	precio.removeClass('is-valid is-invalid').val(0);

	let iva = $('#iva' + clase);
	iva.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	let familia = $('#familia' + clase);
	familia.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	let proveedor = $('#proveedor' + clase);
	proveedor.removeClass('is-valid is-invalid').prop('selectedIndex', 0);

	let stock = $('#stock' + clase);
	stock.removeClass('is-valid is-invalid').val(0);

	let stockMin = $('#stockMin' + clase);
	stockMin.removeClass('is-valid is-invalid').val(0);
}

function filtro(selectorInput, selectorContenido) {
	$(selectorInput).on("keyup", function() {
		let value = $(this).val().toLowerCase();
		$(selectorContenido).filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
	});
}